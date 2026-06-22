import os
import json
import datetime
import pandas as pd
from typing import Dict, Any
from bson import ObjectId
from urllib.parse import urlparse
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from openai import OpenAI
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    load_dotenv(env_path, override=True)
except ImportError:
    pass

app = FastAPI(title="BharatAI Recommendation Service")

class MongoEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        if isinstance(obj, ObjectId):
            return str(obj)
        try:
            from bson import Timestamp
            if isinstance(obj, Timestamp):
                return obj.as_doc()
        except ImportError:
            pass
        return super().default(obj)

def get_db_name(mongo_uri: str) -> str:
    try:
        parsed = urlparse(mongo_uri)
        db_name = parsed.path.lstrip('/').split('?')[0].strip()
        return db_name if db_name else 'test'
    except Exception:
        return 'test'

def get_db_schemes(mongo_uri: str) -> pd.DataFrame:
    client = MongoClient(mongo_uri)
    db = client[get_db_name(mongo_uri)]
    raw = list(db['schemes'].find({}))
    for doc in raw:
        doc['_id'] = str(doc['_id'])
    return pd.DataFrame(raw)

def build_user_query(p: Dict[str, Any]) -> str:
    parts = []
    age = int(p.get('age', 0))
    gender = p.get('gender', '')
    parts.append(f"The applicant is a {age} year old {gender.lower()} citizen of India.")

    state = p.get('state', '')
    district = p.get('district', '')
    residence = p.get('residenceType', 'Urban')
    loc = f"The applicant is a permanent resident of {state}"
    if district:
        loc += f", {district} district"
    loc += f". The applicant lives in a {residence.lower()} area."
    parts.append(loc)

    marital = p.get('maritalStatus', '')
    if marital:
        parts.append(f"The applicant is {marital.lower()}.")
    if marital == 'Widowed':
        parts.append("The applicant is a widow or widower.")

    edu = p.get('education', '')
    parts.append(f"Educational qualification: {edu}.")
    if 'Secondary' in edu or '10th' in edu or '12th' in edu:
        parts.append("The applicant has passed Secondary School Certificate SSC or Higher Secondary Certificate HSC.")
    if 'Graduate' in edu or 'Degree' in edu:
        parts.append("The applicant holds a graduate degree.")

    occ = p.get('occupation', '')
    emp = p.get('employmentStatus', '')
    parts.append(f"The applicant's occupation is {occ}. Employment status: {emp.lower()}.")
    if emp == 'Unemployed':
        parts.append("The applicant is an unemployed youth seeking employment.")
    if emp == 'Daily Wage Worker':
        parts.append("The applicant is a daily wage worker casual labourer.")

    income = int(p.get('annualIncome', 0))
    bpl = p.get('bplStatus', 'No')
    ration = p.get('rationCardType', 'None')
    parts.append(f"Annual income of the family is Rs.{income}/-.")
    if income <= 100000:
        parts.append("The applicant belongs to the economically weaker section EWS with very low income below poverty line.")
    elif income <= 300000:
        parts.append("The annual income is less than or equal to Rs.3,00,000/-.")
    elif income <= 600000:
        parts.append("The annual income is less than or equal to Rs.6,00,000/-.")
    if bpl == 'Yes':
        parts.append("The applicant is a BPL Below Poverty Line card holder.")
    if 'BPL' in ration or 'Antyodaya' in ration or 'PHH' in ration:
        parts.append(f"The applicant holds a {ration} ration card.")

    cat = p.get('category', 'General')
    parts.append(f"The applicant belongs to the {cat} category.")
    if 'SC' in cat:
        parts.append("The applicant is from Scheduled Caste community.")
    if 'ST' in cat:
        parts.append("The applicant is from Scheduled Tribe community.")
    if 'OBC' in cat:
        parts.append("The applicant belongs to Other Backward Class OBC.")
    if 'VJNT' in cat or 'NT' in cat:
        parts.append("The applicant is from Vimukta Jati Nomadic Tribe VJNT NT community.")
    if 'EWS' in cat:
        parts.append("The applicant is from Economically Weaker Section EWS general category.")

    religion = p.get('religion', '')
    minority = p.get('minority', 'No')
    if religion and religion != 'Not Specified':
        parts.append(f"The applicant's religion is {religion}.")
    if minority == 'Yes':
        parts.append("The applicant belongs to a notified minority community.")

    if p.get('studentStatus') == 'Yes':
        parts.append("The applicant is a student currently pursuing education.")
        parts.append("The applicant is enrolled in a school college university degree course.")

    if p.get('farmerStatus') == 'Yes':
        parts.append("The applicant is a farmer engaged in agricultural activities.")
        land = p.get('landOwnership', 'No')
        acres = float(p.get('landSizeAcres', 0))
        if land == 'Yes':
            parts.append(f"The applicant owns {acres} acres of agricultural land.")
        else:
            parts.append("The applicant is a landless farmer or agricultural labourer.")

    if p.get('entrepreneurStatus') == 'Yes':
        parts.append("The applicant is an entrepreneur or self employed person willing to establish a new venture or business.")

    if p.get('disabilityStatus') == 'Yes':
        pct = int(p.get('disabilityPercentage', 40))
        parts.append(f"The applicant is a Person with Disability PwD with {pct}% disability.")
        if pct >= 40:
            parts.append("The disability percentage is 40% or above making the applicant eligible for disability schemes.")
        parts.append("The applicant is visually handicapped hearing impaired orthopedically handicapped or has a mental disability.")

    if age >= 60 or p.get('seniorCitizen') == 'Yes':
        parts.append("The applicant is a senior citizen above 60 years of age.")

    if p.get('exServiceman') == 'Yes':
        parts.append("The applicant is an ex-serviceman or defence personnel or veteran.")

    if p.get('constructionWorker') == 'Yes':
        parts.append("The applicant is a registered building and other construction worker under BOCW Maharashtra Building and Other Construction Workers Welfare Board MBOCWW.")

    return ' '.join(parts)

def normalize_scores(scores, top_score_target=0.92, min_score_floor=0.45):
    import numpy as np
    arr = scores.copy()
    mn, mx = arr.min(), arr.max()
    if mx == mn:
        return [top_score_target] * len(arr)
    normalized = min_score_floor + (arr - mn) / (mx - mn) * (top_score_target - min_score_floor)
    return normalized.round(3).tolist()

def get_api_keys():
    keys_str = os.environ.get("OPENROUTER_API_KEYS", "")
    keys = [k.strip() for k in keys_str.split(",") if k.strip()]
    single_key = os.environ.get("OPENROUTER_API_KEY", "")
    if single_key and single_key not in keys:
        keys.append(single_key)
    fallback_hardcoded = []
    for hk in fallback_hardcoded:
        if hk not in keys:
            keys.append(hk)
    return keys

MODELS_FALLBACK = [
    "google/gemma-4-31b-it:free",
    "openrouter/free",
    "openrouter/auto"
]

def call_openrouter_with_fallback(messages):
    keys = get_api_keys()
    for model in MODELS_FALLBACK:
        for key in keys:
            try:
                client = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=key,
                )
                completion = client.chat.completions.create(
                    model=model,
                    messages=messages,
                )
                content = completion.choices[0].message.content.strip()
                if content:
                    return content
            except Exception as e:
                import sys
                sys.stderr.write(f"Failed using key ...{key[-6:]} and model {model}: {e}\n")
                continue
    raise Exception("All OpenRouter keys and fallback models failed.")

def parse_json_from_llm(content):
    content = content.strip()
    if not content:
        raise ValueError("Empty LLM content")
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    if "```" in content:
        parts = content.split("```")
        for part in parts[1::2]:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            try:
                return json.loads(part)
            except json.JSONDecodeError:
                pass
                
    start = content.find("{")
    end = content.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            return json.loads(content[start:end+1])
        except json.JSONDecodeError:
            pass
            
    start_arr = content.find("[")
    end_arr = content.rfind("]")
    if start_arr != -1 and end_arr != -1 and end_arr > start_arr:
        try:
            return json.loads(content[start_arr:end_arr+1])
        except json.JSONDecodeError:
            pass

    raise ValueError(f"Could not parse JSON from: {content}")

def llm_evaluate(user_profile: Dict[str, Any], schemes: pd.DataFrame, openrouter_key: str):
    lang = user_profile.get("lang", "en")
    profile_str = json.dumps(user_profile, indent=2)
    schemes_str = ""
    for _, row in schemes.iterrows():
        schemes_str += f"Scheme:\n"
        schemes_str += f"  Name: {row.get('schemeName', '')}\n"
        elig = row.get('eligibility', [])
        if isinstance(elig, list):
            elig = ' '.join(elig)
        schemes_str += f"  Eligibility: {elig}\n\n"

    reasoning_format = "<1-2 sentence plain-English explanation of why they qualify or don't>"
    missing_format = "<specific requirement they don't meet, if any>"
    if lang == "hi":
        reasoning_format = "<1-2 sentence plain-Hindi explanation (written in Devanagari script) of why they qualify or don't>"
        missing_format = "<specific requirement they don't meet in Hindi (written in Devanagari script), if any>"

    prompt = f"""You are BharatAI, an expert Indian government welfare scheme advisor.
Carefully assess if the following user is eligible for each scheme based on their profile.

User Profile:
{profile_str}

Schemes to evaluate:
{schemes_str}

Respond ONLY with a JSON object like:
{{
  "results": [
    {{
      "schemeName": "<exact scheme name>",
      "isEligible": true or false,
      "reasoning": "{reasoning_format}",
      "missingRequirements": ["{missing_format}"]
    }}
  ]
}}
"""

    try:
        messages = [
            {"role": "system", "content": "You are a JSON-only responder. Never include markdown code fences."},
            {"role": "user", "content": prompt}
        ]
        content = call_openrouter_with_fallback(messages)
        parsed = parse_json_from_llm(content)
        return parsed.get("results", parsed)
    except Exception as e:
        return {"error": str(e)}

def safe_serialize(obj):
    if isinstance(obj, dict):
        return {k: safe_serialize(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [safe_serialize(i) for i in obj]
    elif isinstance(obj, (datetime.datetime, datetime.date)):
        return obj.isoformat()
    elif isinstance(obj, ObjectId):
        return str(obj)
    else:
        try:
            from bson import Timestamp
            if isinstance(obj, Timestamp):
                return str(obj)
        except Exception:
            pass
        return obj

def pre_filter_schemes(df: pd.DataFrame, p: Dict[str, Any]) -> pd.DataFrame:
    filtered = df.copy()
    gender = p.get('gender', 'Male').lower()
    cat = p.get('category', 'General').lower()
    is_disabled = p.get('disabilityStatus', 'No') == 'Yes'
    is_student = p.get('studentStatus', 'No') == 'Yes'
    is_farmer = p.get('farmerStatus', 'No') == 'Yes'
    is_bocw = p.get('constructionWorker', 'No') == 'Yes'
    
    drop_indices = []

    for idx, row in filtered.iterrows():
        c = str(row.get('category', '')).lower()
        name = str(row.get('schemeName', '')).lower()
        desc = str(row.get('description', '')).lower()
        
        def join_list(val):
            if isinstance(val, list):
                return ' '.join(str(v) for v in val)
            return str(val) if val else ''
        
        elig = join_list(row.get('eligibility', [])).lower()
        tags_text = c + " " + name + " " + desc + " " + elig

        if gender == 'male':
            if 'female' in tags_text or 'women' in tags_text or 'mahila' in tags_text or 'mata' in tags_text or 'kanya' in tags_text or 'pregnant' in tags_text or 'girl' in tags_text:
                drop_indices.append(idx)
                continue
                
        if not is_disabled:
            if 'disability' in c or 'disabled' in c or 'blind' in tags_text or 'impaired' in tags_text:
                drop_indices.append(idx)
                continue

        if not is_farmer:
            if 'farmer' in c or 'agriculture' in c:
                drop_indices.append(idx)
                continue

        if not is_student:
            if 'education' in c or 'school' in c or 'student' in c or 'scholarship' in tags_text:
                drop_indices.append(idx)
                continue

        if not is_bocw:
            if 'construction worker' in c or 'bocw' in tags_text:
                drop_indices.append(idx)
                continue

        if cat == 'general':
            if 'scheduled caste' in tags_text or ' sc ' in tags_text or 'charmakar' in tags_text or 'dhor' in tags_text or \
               'scheduled tribe' in tags_text or ' st ' in tags_text or \
               'other backward' in tags_text or ' obc ' in tags_text or \
               'vjnt' in tags_text or 'nomadic tribe' in tags_text or ' nt ' in tags_text or \
               'special backward' in tags_text or ' sbc ' in tags_text:
                drop_indices.append(idx)
                continue
        else:
            mentions_sc = 'scheduled caste' in tags_text or ' sc ' in tags_text or 'charmakar' in tags_text or 'dhor' in tags_text
            mentions_st = 'scheduled tribe' in tags_text or ' st ' in tags_text
            mentions_obc = 'other backward' in tags_text or ' obc ' in tags_text
            mentions_vjnt = 'vjnt' in tags_text or 'nomadic tribe' in tags_text or ' nt ' in tags_text
            mentions_sbc = 'special backward' in tags_text or ' sbc ' in tags_text
            
            any_reserved = mentions_sc or mentions_st or mentions_obc or mentions_vjnt or mentions_sbc
            
            if any_reserved:
                user_match = False
                if 'sc' in cat and mentions_sc: user_match = True
                if 'st' in cat and mentions_st: user_match = True
                if 'obc' in cat and mentions_obc: user_match = True
                if 'vjnt' in cat and mentions_vjnt: user_match = True
                if 'nt' in cat and mentions_vjnt: user_match = True
                if 'sbc' in cat and mentions_sbc: user_match = True
                
                if not user_match:
                    drop_indices.append(idx)
                    continue

    return filtered.drop(index=drop_indices).reset_index(drop=True)

@app.post("/recommend")
def get_recommendations(user_profile: Dict[str, Any]):
    mongo_uri = os.environ.get("MONGODB_URI")
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")

    if not mongo_uri or not openrouter_key:
        raise HTTPException(status_code=500, detail="Missing MONGODB_URI or OPENROUTER_API_KEY environment variables")

    try:
        raw_df = get_db_schemes(mongo_uri)
        if raw_df.empty:
            return {"top_ml_matches": [], "llm_evaluation": []}

        df = pre_filter_schemes(raw_df, user_profile)
        if df.empty:
            return {"top_ml_matches": [], "llm_evaluation": []}

        def join_list(val):
            if isinstance(val, list):
                return ' '.join(str(v) for v in val)
            return str(val) if val else ''

        df['combined_text'] = (
            df['schemeName'].fillna('') + ' ' +
            df.get('category', pd.Series([''] * len(df))).fillna('') + ' ' +
            df.get('description', pd.Series([''] * len(df))).fillna('') + ' ' +
            df.get('benefits', pd.Series([[] for _ in range(len(df))])).apply(join_list) + ' ' +
            df.get('eligibility', pd.Series([[] for _ in range(len(df))])).apply(join_list) + ' ' +
            df.get('requiredDocuments', pd.Series([[] for _ in range(len(df))])).apply(join_list)
        )

        user_text = build_user_query(user_profile)

        vectorizer = TfidfVectorizer(
            stop_words='english',
            ngram_range=(1, 2),
            min_df=1,
            sublinear_tf=True,
        )
        all_texts = df['combined_text'].tolist() + [user_text]
        tfidf_matrix = vectorizer.fit_transform(all_texts)
        raw_scores = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1]).flatten()

        user_gender = user_profile.get('gender', '').lower()
        user_cat = user_profile.get('category', '').lower()
        user_income = int(user_profile.get('annualIncome', 0))
        user_bpl = user_profile.get('bplStatus', 'No').lower()
        user_edu = user_profile.get('education', '').lower()
        user_disabled = user_profile.get('disabilityStatus', 'No').lower() == 'yes'
        user_farmer = user_profile.get('farmerStatus', 'No').lower() == 'yes'
        
        for i, row in df.iterrows():
            tags = row['combined_text'].lower()
            multiplier = 1.0
            
            if user_gender in ['female', 'transgender']:
                if 'female' in tags or 'women' in tags or 'mahila' in tags or 'girl' in tags or 'maternity' in tags:
                    multiplier += 0.30
                    
            if user_cat != 'general' and user_cat in tags:
                multiplier += 0.25
                
            if user_bpl == 'yes' or user_income <= 100000:
                if 'bpl' in tags or 'below poverty line' in tags or 'ews' in tags or 'economically weaker' in tags:
                    multiplier += 0.20
                    
            if user_disabled and ('disabled' in tags or 'disability' in tags or 'blind' in tags):
                multiplier += 0.20
            if user_farmer and ('farmer' in tags or 'agriculture' in tags or 'krishi' in tags):
                multiplier += 0.20
            
            if ('iti' in user_edu or 'diploma' in user_edu) and ('iti' in tags or 'diploma' in tags):
                multiplier += 0.15
                
            raw_scores[i] = min(1.0, raw_scores[i] * multiplier)

        normalized = normalize_scores(raw_scores)
        df['raw_score'] = raw_scores
        df['match_score'] = normalized

        top_schemes = df.nlargest(5, 'raw_score').drop(columns=['combined_text', 'raw_score'])
        llm_results = llm_evaluate(user_profile, top_schemes, openrouter_key)
        top_records = [safe_serialize(row) for row in top_schemes.to_dict(orient='records')]

        return {
            "top_ml_matches": top_records,
            "llm_evaluation": llm_results
        }
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail={"error": str(e), "trace": traceback.format_exc()})

class SimplifyRequest(BaseModel):
    scheme_text: str
    lang: str = "en"

@app.post("/simplify")
def simplify_scheme(req: SimplifyRequest):
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    if not openrouter_key:
        raise HTTPException(status_code=500, detail="Missing OPENROUTER_API_KEY")

    prompt = f"""Simplify this government scheme into 2-3 short, extremely simple sentences.
Use plain language that a 5th grader can understand.
{'Respond in Hindi (Devanagari script).' if req.lang == 'hi' else 'Respond in English.'}

Scheme Details:
{req.scheme_text}
"""
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant that simplifies complex texts."},
            {"role": "user", "content": prompt}
        ]
        content = call_openrouter_with_fallback(messages)
        return {"summary": content}
    except Exception as e:
        import traceback
        raise HTTPException(status_code=500, detail={"error": str(e), "trace": traceback.format_exc()})

class EvaluateEligibilityRequest(BaseModel):
    user_profile: Dict[str, Any]
    scheme: Dict[str, Any]
    lang: str = "en"

@app.post("/evaluate-eligibility")
def evaluate_eligibility_endpoint(req: EvaluateEligibilityRequest):
    openrouter_key = os.environ.get("OPENROUTER_API_KEY")
    if not openrouter_key:
        raise HTTPException(status_code=500, detail="Missing OPENROUTER_API_KEY")

    # We reuse the existing llm_evaluate logic, but passing just 1 scheme
    df = pd.DataFrame([req.scheme])
    req.user_profile['lang'] = req.lang
    
    results = llm_evaluate(req.user_profile, df, openrouter_key)
    
    if isinstance(results, list) and len(results) > 0:
        return results[0]
    elif isinstance(results, dict) and "error" in results:
        raise HTTPException(status_code=500, detail=results["error"])
    return results

import os
import json
import datetime
from pathlib import Path
from pymongo import MongoClient
from pymongo.errors import PyMongoError

def extract_specs(suite, spec_list):
    """Recursively extract specs from suites."""
    if 'specs' in suite:
        for spec in suite['specs']:
            spec_list.append(spec)
    if 'suites' in suite:
        for sub_suite in suite['suites']:
            extract_specs(sub_suite, spec_list)

def main():
    print("Starting test results upload to MongoDB...")
    
    # Path to results.json
    base_dir = Path(__file__).resolve().parent.parent
    results_path = base_dir / "test-results" / "results.json"
    
    if not results_path.exists():
        print(f"Error: Playwright results file not found at: {results_path}")
        print("Skipping database upload.")
        return

    try:
        with open(results_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
    except Exception as e:
        print(f"Error: Failed to parse results.json: {e}")
        return

    # Extract statistics
    stats = raw_data.get("stats", {})
    passed = stats.get("expected", 0)
    failed = stats.get("unexpected", 0)
    skipped = stats.get("skipped", 0)
    flaky = stats.get("flaky", 0)
    total = passed + failed + skipped
    
    pass_percentage = (passed / total * 100) if total > 0 else 0.0
    duration_sec = stats.get("duration", 0) / 1000.0

    # Extract individual test cases
    specs = []
    for suite in raw_data.get("suites", []):
        extract_specs(suite, specs)

    tests_details = []
    for spec in specs:
        test_case = {
            "title": spec.get("title", "Unnamed Test"),
            "file": spec.get("file", ""),
            "line": spec.get("line", 0),
            "ok": spec.get("ok", False),
        }
        
        # Get project & result details if available
        tests_data = spec.get("tests", [])
        if tests_data:
            first_test = tests_data[0]
            test_case["project"] = first_test.get("projectName", "default")
            
            results = first_test.get("results", [])
            if results:
                first_result = results[0]
                test_case["status"] = first_result.get("status", "")
                test_case["duration_ms"] = first_result.get("duration", 0)
                
                # Check for errors
                errors = first_result.get("errors", [])
                if errors:
                    test_case["error"] = errors[0].get("message", "")
        
        tests_details.append(test_case)

    # Gather environment metadata (GHA / Local)
    run_id = os.getenv("GITHUB_RUN_ID")
    run_number = os.getenv("GITHUB_RUN_NUMBER")
    git_sha = os.getenv("GITHUB_SHA")
    git_ref = os.getenv("GITHUB_REF")
    repo = os.getenv("GITHUB_REPOSITORY", "employee-management-portal")
    actor = os.getenv("GITHUB_ACTOR")

    # Document to insert
    report_doc = {
        "repository": repo.split("/")[-1],
        "full_repository": repo,
        "timestamp": datetime.datetime.now(datetime.timezone.utc),
        "start_time": stats.get("startTime"),
        "duration_sec": duration_sec,
        "summary": {
            "total": total,
            "passed": passed,
            "failed": failed,
            "skipped": skipped,
            "flaky": flaky,
            "pass_percentage": round(pass_percentage, 2)
        },
        "tests": tests_details
    }

    if run_id:
        report_doc["github_actions"] = {
            "run_id": run_id,
            "run_number": int(run_number) if run_number else None,
            "sha": git_sha,
            "ref": git_ref,
            "actor": actor
        }

    # Connection URI
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
    
    print(f"Connecting to MongoDB...")
    try:
        # Limit connection timeout to 5 seconds to fail fast if no db is available
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client["test-results"]
        collection = db["test-res-repo"]
        
        # Verify connection
        client.admin.command('ping')
        
        # Insert report
        result = collection.insert_one(report_doc)
        print(f"[SUCCESS] Test results successfully saved to MongoDB collection 'test-res-repo'. Inserted ID: {result.inserted_id}")
        
    except PyMongoError as err:
        print(f"[WARNING] Failed to upload test results to MongoDB: {err}")
        print("Test execution pipeline continues unimpeded.")

if __name__ == "__main__":
    main()

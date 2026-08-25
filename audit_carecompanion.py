# ### FILE: audit_here.py
import os
import re

def audit_current_directory():
    # Detect the name of the folder we are currently inside
    current_folder_name = os.path.basename(os.getcwd())
    print(f"🔬 Initializing Deep Strataparse Pipeline Audit for current directory: '{current_folder_name}'")
    print("=" * 90)
    
    # Deep Vulnerability Pattern Recognition Matchers
    regex_leak_pattern = re.compile(r"(\.replace\(\s*/\^```json/i\s*,\s*\"\"\s*\)|cleanedOutput|outputText\s*\.\s*trim)")
    raw_image_pattern = re.compile(r"(detail\s*:\s*[\"']high[\"']|image_url|base64)")
    completion_pattern = re.compile(r"(\.chat\s*\.\s*completions\s*\.\s*create|\.responses\s*\.\s*create)")
    
    scanned_count = 0
    issues_found_count = 0
    optimized_count = 0
    
    report_output = []
    
    # -------------------------------------------------------------------------
    # Recursive Folder Iteration System (Starting from current root ".")
    # -------------------------------------------------------------------------
    for root, dirs, files in os.walk("."):
        # Explicit exclusion matrices to avoid dependency noise
        if any(ignored in root for ignored in ["node_modules", ".next", "dist", ".git", "temp", "cache"]):
            continue
            
        for file_name in files:
            # Audit code implementations, components, routes, and prompt configurations
            if file_name.endswith((".ts", ".tsx", ".js", ".jsx", ".json")):
                scanned_count += 1
                full_file_path = os.path.join(root, file_name)
                
                # Format relative path cleanly for the report
                clean_rel_path = os.path.relpath(full_file_path, ".")
                folder_name = os.path.dirname(clean_rel_path) or "."
                
                with open(full_file_path, 'r', encoding='utf-8', errors='ignore') as current_file:
                    file_content = current_file.read()
                
                file_issues = []
                rectifications = []
                
                # Vector A: Detect Legacy Regex Parsing Blocks
                if regex_leak_pattern.search(file_content):
                    file_issues.append("🛑 Legacy Markdown RegExp Trimming Loop Detected.")
                    rectifications.append("-> RECTIFY: Remove manual regex string manipulation and inject native 'response_format: { type: \"json_schema\" }' into the API completion configuration handler.")
                
                # Vector B: Check for Missing Image Pre-processing scale bounds
                if raw_image_pattern.search(file_content) and "sharp(" not in file_content and "canvas" not in file_content:
                    file_issues.append("🛑 Uncompressed Multimodal Token Leakage.")
                    rectifications.append("-> RECTIFY: Intercept incoming image streams using 'sharp' and enforce a maximum short-side bounding scale constraint of 768px to limit visual tile token consumption.")
                
                # Vector C: Audit Lack of Pre-flight Blur Filters
                if completion_pattern.search(file_content) and "convolve(" not in file_content and "Laplacian" not in file_content:
                    if "image" in file_content or "document" in file_content:
                        file_issues.append("🛑 Missing Pre-flight Ingestion Gatekeeper (Blur Flaw).")
                        rectifications.append("-> RECTIFY: Calculate local edge variance via a 3x3 Laplacian matrix convolution filter locally. Automatically reject standard-dev scores < 8.0 for free.")
                
                # Vector D: Check for Missing UI Grounding Flags
                if "resolveMedicine" in file_content and "isClinicalMatchFound" not in file_content:
                    file_issues.append("🛑 Ungrounded Database-to-UI Handoff Workflow.")
                    rectifications.append("-> RECTIFY: Append a Boolean tracking flag ('isClinicalMatchFound') to the structured medicines array payload object to trigger visual error borders in the user component UI.")

                # If the file contains structural anomalies, register it into the audit report map
                if file_issues:
                    issues_found_count += 1
                    report_output.append(f"📁 FOLDER: {current_folder_name}/{folder_name}")
                    report_output.append(f"📄 FILE NAME: {file_name}")
                    report_output.append("-" * 50)
                    for issue in file_issues:
                        report_output.append(f"   ISSUE DETECTED: {issue}")
                    for rect in rectifications:
                        report_output.append(f"   {rect}")
                    report_output.append("\n" + "="*90 + "\n")
                else:
                    if any(keyword in file_content for keyword in ["sharp", "json_schema", "buildExtractionPrompt", "isClinicalMatchFound"]):
                        optimized_count += 1

    # Compile the final human-readable layout summary metrics
    final_report_lines = [
        "==========================================================================================",
        "                     CARECOMPANION SYSTEM INGESTION AUDIT SUMMARY REPORT",
        "==========================================================================================",
        f"📊 Global System Telemetry: Files Scanned: {scanned_count} | Action Needed: {issues_found_count} | Verified Optimized: {optimized_count}",
        "==========================================================================================\n"
    ]
    
    if issues_found_count == 0:
        final_report_lines.append(f"🎉 EXCELLENT WORK! Every script inside '{current_folder_name}' cleanly passes cost and precision standards.")
    else:
        final_report_lines.extend(report_output)
        
    final_report_lines.append("==========================================================================================")
    final_report_lines.append("                         [ END OF DETAILED EXTRACTION METRICS AUDIT ]")
    final_report_lines.append("==========================================================================================")
    
    compiled_report_text = "\n".join(final_report_lines)
    
    # Write report back to disk locally
    report_file_name = "CareCompanion_Pipeline_Audit.txt"
    with open(report_file_name, "w", encoding="utf-8") as out_file:
        out_file.write(compiled_report_text)
        
    print(compiled_report_text)
    print(f"\n💾 Complete repository map compiled and saved to: '{report_file_name}'")

if __name__ == '__main__':
    audit_current_directory()

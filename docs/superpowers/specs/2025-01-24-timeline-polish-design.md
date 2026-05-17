# Design Spec - Timeline Feature Polish

## Overview
This document outlines the final polish for the timeline feature, focusing on API consistency and robust data fetching.

## Goals
- Align API response layout with project conventions.
- Improve error handling in the frontend fetch logic.

## Design

### 1. API Layout Update
- **File**: `api/iran_timeline.json`
- **Change**: Update frontmatter `layout` from `none` to `null`.
- **Reasoning**: Project convention for JSON endpoints.

### 2. Fetch Logic Error Handling
- **File**: `_posts/2026-05-17-iran-political-timeline.markdown`
- **Change**: Explicitly check `response.ok` before parsing JSON.
- **Code Change**:
  ```javascript
  Promise.all(selectedUrls.map(url => fetch(url).then(res => {
    if (!res.ok) throw new Error("Network response was not ok: " + res.statusText);
    return res.json();
  })))
  ```
- **Reasoning**: Prevents `json()` from being called on failed responses (e.g., 404, 500), providing clearer error messages and better resilience.

## Verification Plan
1. Manually verify `api/iran_timeline.json` returns valid JSON without layout wrapping (if testing in Jekyll environment).
2. Verify that the timeline still renders correctly in the post.
3. (Optional) Simulate a network failure or 404 to ensure the error handling works as expected.

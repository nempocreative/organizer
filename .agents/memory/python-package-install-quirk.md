---
name: Python package setup
description: A workspace-specific issue encountered when trying to install Python packages.
---

The workspace has a `.pythonlibs` directory, but it is not a valid Python environment. `installLanguagePackages` attempted `uv add` and failed because no Python executable existed in that directory.

**Why:** Repeating the same install call will not repair the environment and may waste time on one-off tasks.

**How to apply:** Before installing Python packages, check or configure the Python runtime. For one-off outputs, first check whether an already-installed workspace package can create or validate the file.

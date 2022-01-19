# Versioning your Python

`pip install versioneer`

```python
[versioneer]
VCS = git
style = pep440
versionfile_source = src/myproject/_version.py
versionfile_build = myproject/_version.py
tag_prefix =
parentdir_prefix = myproject-
```
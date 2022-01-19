import setuptools
import versioneer

with open("README.MD", "r") as fh:
    long_description = fh.read()
with open("requirements.txt", "r") as fh:
    requirements = [line.strip() for line in fh]

setuptools.setup(
    name="hellover",
    version=versioneer.get_version(),
    cmdclass=versioneer.get_cmdclass(),
    author="Adam",
    author_email="adam@eden.com",
    description="Versioneer test.",
    long_description=long_description,
    long_description_content_type="text/x-rst",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
    install_requires=requirements,
)

import zipfile
from pathlib import Path

import pathspec

IGNORE: list[str] = [
    "*.py",
    ".git",
]

INCLUDE: list[str] = [
]

dist = Path(".")

if __name__ == "__main__":

    with open(dist / ".gitignore") as f:
        spec = pathspec.GitIgnoreSpec.from_lines(f)

    spec += pathspec.GitIgnoreSpec.from_lines(IGNORE)

    include_spec = pathspec.PathSpec.from_lines("gitwildmatch", INCLUDE)

    print(f"Zipping {dist}...")
    with zipfile.ZipFile("ESTR2106_project.zip", "w") as zip:
        for filename in spec.match_tree(dist, negate=True):
            # if not include_spec.match_file(filename):
            #     continue
            print(f"Adding {filename}...")
            file = Path(dist / filename)
            if file.is_file():
                zip.write(file, filename)

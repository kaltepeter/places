if [[ $# -ne 2 ]]; then
  echo "Please provide a project name and a project path to import an existing package. Example :"
  echo "   $0 my_project path/to/my_project"
  exit 1
fi

project_name=$1
project_path=$2

git subtree add -P packages/$project_name $project_path master
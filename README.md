# VRA Repeal Analysis
This project seeks to understand the implications of the potential Supreme Court dismissal of Section 2 of the Voting Rights Act (VRA).

The approach to data analysis and the underlying methodology draw upon [Computational Redistricting and the Voting Rights Act](https://www.brennancenter.org/sites/default/files/2023-11/Computational%20Redistricting%20and%20the%20Voting%20Rights%20Act%20FINAL%20PUBLISHED%20VERSION%20elj.2020.0704.pdf).

## Team Members
- Hannah Lee
- Xinyue Su
- Christine Song

## Tech Stack
- ReactJS, TailwindCSS, SpringJS, MongoDB, Python

**Prerequisites**
- Node v22.14.0
- npm 10.9.2
- Python 3.13.2
- Java 23.0.1
- SBU Authentication for SeaWulf access

## Contents
- `/client/`: Contains all client-side source code, including frontend logic, and user interfaces.
- `/server/`: Holds server-side source code, including APIs, backend logic, and data handling services.
- `/data/`: Shared directory for selected state data.
- `/preprocessing/`: Includes Jupyter notebooks and generated outputs for data cleaning, transformation, and calculations.
- `/seawulf/`: Contains scripts and outputs related to processing on the SeaWulf.


## Set Up

**Client**

```bash
cd client
npm install
npm run dev
```

**Server**

```bash
cd server
./gradlew build
./gradlew bootRun
```

**Python Preprocessing**

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install
cd preprocessing
```

**SeaWulf**

Connect:

```bash
# Mac/Linux
ssh netid@login.seawulf.stonybrook.edu

# for higher demand work
ssh netid@milan.seawulf.stonybrook.edu 

# Windows: use MobaXterm
```

Submit a Job: 
```bash
module load slurm
module load cuda
module load python
sbatch scripts/your_job.slurm
```

Copy file to SeaWulf:
```
scp file.txt netid@login.seawulf.stonybrook.edu:~/vra_analysis/inputs
```

Copy directory:
```
scp -r vra_analysis/ netid@login.seawulf.stonybrook.edu:~/vra_analysis/
```

Monitoring Jobs:
```
squeue -u $USER
scancel <job_id>
```

## Postman Testing
Import `server/postman_tests.json` into Postman to explore the available endpoints and test the server. Further documentation on expected parameters, associated use cases, and referenced terminology are also included.

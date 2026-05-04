# VRA Repeal 
This project seeks to understand the implications of the potential Supreme Court dismissal of Section 2 of the Voting Rights Act (VRA).

The approach to data analysis and the underlying methodology draw upon [Computational Redistricting and the Voting Rights Act](https://www.brennancenter.org/sites/default/files/2023-11/Computational%20Redistricting%20and%20the%20Voting%20Rights%20Act%20FINAL%20PUBLISHED%20VERSION%20elj.2020.0704.pdf) 

## Team Members
- Hannah Lee
- Xinyue Su
- Christine Song

## Tech Stack
- ReactJS, TailwindCSS, SpringJS, MongoDB, Python

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
cd python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install
```

**SeaWulf**

Connect:

```bash
# Mac/Linux
ssh netid@login.seawulf.stonybrook.edu

# Windows: use MobaXterm
```

Submit a Job: 
```bash
module load slurm
sbatch python/your_job.slurm
```

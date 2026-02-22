export type Bite = {
  title: string;
  text: string;
};

export type Lesson = {
  id: string;
  title: string;
  time: string;
  objective: string;
  bites: Bite[];
  practice?: string[];
  check?: string;
};

export type Module = {
  id: string;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type LearningTrack = {
  id: string;
  title: string;
  subtitle: string;
  sourceLabel: string;
  modules: Module[];
};

export const learningTracks: LearningTrack[] = [
  {
    id: "git-pega",
    title: "Git",
    subtitle: "",
    sourceLabel: "",
    modules: [
      {
        id: "core-git",
        title: "Module 1: Core Git Workflow",
        summary: "Git zones, daily commands, staging, history, and branching.",
        lessons: [
          {
            id: "zones",
            title: "Git in One Picture",
            time: "7 min",
            objective: "Understand the three Git zones and why branches are safe parallel universes.",
            bites: [
              {
                title: "Core concept",
                text: "Git stores snapshots called commits and lets you create parallel branches.",
              },
              {
                title: "Three zones",
                text: "Working Directory -> Staging Area -> Repository is the default change flow.",
              },
              {
                title: "Mistake pattern",
                text: "Most confusion comes from not knowing which zone a file is currently in.",
              },
            ],
            practice: ["git status", "git add <file>", "git commit -m \"checkpoint\""],
            check: "Can you explain which command moves changes between each zone?",
          },
          {
            id: "daily-five",
            title: "The 5 Commands You Will Use Every Day",
            time: "5 min",
            objective: "Run a reliable daily command loop and complete a first commit.",
            bites: [
              {
                title: "Daily set",
                text: "git status, git add -p, git commit -m \"message\", git pull, git push.",
              },
              {
                title: "When stuck",
                text: "Start with git status; it tells you what Git expects next.",
              },
            ],
            practice: [
              "mkdir hello-git",
              "cd hello-git",
              "git init",
              "echo \"Hello Git\" > notes.txt",
              "git add notes.txt",
              "git commit -m \"First commit: add notes\"",
            ],
            check: "Can you create one repository and commit from scratch without GUI tools?",
          },
          {
            id: "staging-power",
            title: "Staging: The Misunderstood Superpower",
            time: "7 min",
            objective: "Use staging intentionally to build clean, reviewable commits.",
            bites: [
              {
                title: "Why staging exists",
                text: "You often edit many things, but should commit one clear change at a time.",
              },
              {
                title: "Best practice",
                text: "Use git add -p to stage selected lines, not whole files by default.",
              },
            ],
            practice: [
              "git add app.js",
              "git add -p",
              "git status",
            ],
            check: "Can you explain the difference between staging a file and staging a hunk?",
          },
          {
            id: "history-undo",
            title: "History and Undo Without Breaking the Team",
            time: "8 min",
            objective: "Choose the right undo method: restore, revert, or reset.",
            bites: [
              {
                title: "Three undo styles",
                text: "restore (local file), revert (safe shared undo), reset (history rewrite).",
              },
              {
                title: "Team-safe default",
                text: "Prefer git revert for shared branches to avoid rewriting public history.",
              },
            ],
            practice: [
              "git log --oneline --graph --decorate --all",
              "git restore notes.txt",
              "git revert <commit_sha>",
            ],
            check: "Can you state when reset is risky in collaborative branches?",
          },
          {
            id: "branching",
            title: "Branching (Parallel Universes)",
            time: "7 min",
            objective: "Create, switch, and merge feature branches without disturbing main.",
            bites: [
              {
                title: "Workflow",
                text: "Create feature branch, work there, then merge to main when ready.",
              },
              {
                title: "Mental model",
                text: "Branches are separate storylines you can merge when complete.",
              },
            ],
            practice: [
              "git switch -c feature/login",
              "git switch main",
              "git merge feature/login",
            ],
            check: "Can you describe exactly what merge changes on main?",
          },
          {
            id: "merge-conflicts",
            title: "Merge Conflicts (Do Not Panic)",
            time: "6 min",
            objective: "Resolve conflicts using a calm, repeatable process.",
            bites: [
              {
                title: "Conflict meaning",
                text: "A conflict means Git needs your decision when two edits overlap.",
              },
              {
                title: "Resolution flow",
                text: "Pull, inspect markers, edit final truth, stage resolved files, commit.",
              },
            ],
            practice: [
              "git pull",
              "git status",
              "git add <fixed_files>",
              "git commit",
            ],
            check: "After resolving, did you run a quick behavior check before commit?",
          },
        ],
      },
      {
        id: "git-pega-map",
        title: "Module 2: Git Daily Mastery",
        summary: "Operational Git habits for daily development, collaboration, and safe recovery.",
        lessons: [
          {
            id: "ten-commands",
            title: "Daily Git Flow (Simple and Practical)",
            time: "9 min",
            objective: "Follow one simple Git routine every day so your commits stay clean and collaboration stays easy.",
            bites: [
              {
                title: "Before you start coding",
                text: "Run git status first, then git pull --rebase origin main to start from the latest code.",
              },
              {
                title: "Create your feature branch",
                text: "Use git switch -c feature/<short-name> so your work stays isolated and easy to review.",
              },
              {
                title: "Commit cleanly",
                text: "Use git add -p to stage only related changes, then write one clear commit message.",
              },
              {
                title: "Push with confidence",
                text: "Check git diff --staged and git log --oneline --graph before pushing to avoid surprises.",
              },
              {
                title: "If something goes wrong",
                text: "Use git restore for local undo and git revert for shared history. Prefer safe undo over force fixes.",
              },
            ],
            practice: [
              "git status",
              "git pull --rebase origin main",
              "git log --oneline --graph --decorate --all",
              "git switch -c feature/update-login-copy",
              "git add -p",
              "git commit -m \"feat: improve login helper text\"",
              "git diff --staged",
              "git push -u origin feature/update-login-copy",
              "git revert <sha>",
              "git restore --staged <file>",
            ],
            check: "Can you complete this full flow from status to push and explain why each step is used?",
          },
        ],
      },
    ],
  },
  {
    id: "containers-orchestration",
    title: "Containers & Orchestration",
    subtitle: "",
    sourceLabel: "",
    modules: [
      {
        id: "containers-core",
        title: "Module 1: Container Foundations",
        summary: "From containers vs VMs to Docker packaging flow.",
        lessons: [
          {
            id: "containers-not-vm",
            title: "Containers Are Not Tiny VMs",
            time: "6 min",
            objective: "Differentiate container process isolation from VM machine virtualization.",
            bites: [
              {
                title: "Core distinction",
                text: "A container is an isolated process; a VM is a full machine with guest OS.",
              },
              {
                title: "Why faster",
                text: "Containers share the host kernel, so startup and resource usage are lighter.",
              },
            ],
            practice: [
              "docker ps",
              "docker stats",
              "Compare startup time of a container vs a VM in your environment.",
            ],
            check: "Can you explain where the guest OS exists in VM but not in a container?",
          },
          {
            id: "docker-lunchbox",
            title: "Docker: The Lunchbox for Your App",
            time: "7 min",
            objective: "Use Dockerfile -> image -> container flow correctly.",
            bites: [
              {
                title: "Build vs run",
                text: "Docker builds images; containers run images.",
              },
              {
                title: "Flow",
                text: "Dockerfile defines recipe, docker build creates image, docker run starts container.",
              },
            ],
            practice: [
              "docker build -t my-app:dev .",
              "docker run --rm --name my-app my-app:dev",
            ],
            check: "Can you identify which step changes only image metadata vs running state?",
          },
        ],
      },
      {
        id: "kubernetes-openshift",
        title: "Module 2: Kubernetes, Pods, and OpenShift",
        summary: "Operate workloads with pods/services and enterprise platform layers.",
        lessons: [
          {
            id: "kubernetes-daycare",
            title: "Kubernetes: Container Daycare",
            time: "8 min",
            objective: "Understand scheduling, self-healing, and scaling behavior in a cluster.",
            bites: [
              {
                title: "What it does",
                text: "Kubernetes schedules pods, restarts failed ones, scales replicas, and routes traffic.",
              },
              {
                title: "Stable endpoint",
                text: "Pods can change, but Service DNS stays stable for callers.",
              },
            ],
            practice: [
              "kubectl get nodes",
              "kubectl get pods -A",
              "kubectl get svc -A",
            ],
            check: "Can you explain why clients target a Service instead of a Pod IP?",
          },
          {
            id: "pods-unit",
            title: "Pods: Smallest Deployable Unit",
            time: "7 min",
            objective: "Understand single-container pod and sidecar pod patterns.",
            bites: [
              {
                title: "Pod model",
                text: "A pod often has one container, but can include sidecars that share network/volumes.",
              },
              {
                title: "Roommates pattern",
                text: "App + sidecar in one pod behave as one operational unit.",
              },
            ],
            practice: [
              "kubectl describe pod <pod-name>",
              "kubectl logs <pod-name> -c <container-name>",
            ],
            check: "Can you describe what resources are shared between containers in one pod?",
          },
          {
            id: "openshift-enterprise",
            title: "OpenShift: Kubernetes with Enterprise Features",
            time: "7 min",
            objective: "Position OpenShift as Kubernetes plus secure-by-default platform capabilities.",
            bites: [
              {
                title: "Platform layer",
                text: "OpenShift adds security defaults, developer console, registry, routes, and integrated tooling.",
              },
              {
                title: "One-liner",
                text: "OpenShift = Kubernetes + secure defaults + enterprise platform features.",
              },
            ],
            practice: [
              "oc get projects",
              "oc get routes -A",
              "oc get pods -A",
            ],
            check: "Can you state what OpenShift adds beyond upstream Kubernetes?",
          },
          {
            id: "etc-explainers",
            title: "Fast Explainers + Cheat Sheet",
            time: "9 min",
            objective: "Quickly identify core platform objects and when to use each.",
            bites: [
              {
                title: "Fast terms",
                text: "Helm, Ingress, Ingress Controller, ConfigMap, Secret, StatefulSet, DaemonSet, HPA, Service Mesh, Operator, Namespace.",
              },
              {
                title: "Cheat sheet",
                text: "Docker=image build, Container=running image, Kubernetes=runs pods, Service=stable DNS, OpenShift=enterprise Kubernetes.",
              },
            ],
            practice: [
              "Create your own one-page glossary for these objects in your team context.",
              "Map one production incident to the object that should have handled it.",
            ],
            check: "Can you pick the right object for config, secret, stateful app, and autoscaling?",
          },
        ],
      },
    ],
  },
];

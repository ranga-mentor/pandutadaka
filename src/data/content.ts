// src/data/content.ts

export type Callout = {
  type: "note" | "brain" | "tip" | "warning";
  title: string;
  text: string;
};

export type ChapterType = {
  id: number;
  title: string;
  text: string;
  code?: string[] | string;
  callouts?: Callout[];
  diagrams?: string[];
};

export const chapters: ChapterType[] = [
  {
    id: 1,
    title: "Git in one picture",
    text: "Git is a time machine for your code. It stores snapshots called commits and lets you create parallel universes called branches.",
    diagrams: ["/images/git-zones.png"],
    callouts: [
      {
        type: "brain",
        title: "Brain note 🧠",
        text: "Most Git mistakes happen because people forget which zone they’re in: working, staging, or committed."
      }
    ]
  },
  {
    id: 2,
    title: "The 5 commands you’ll use every day",
    text: "If you learn only these commands, you can survive on any team.",
    code: ["git status", "git add -p", 'git commit -m "message"', "git pull", "git push"],
    callouts: [
      {
        type: "tip",
        title: "Sticky note 📌",
        text: "If you don’t know what to do next: run git status."
      }
    ]
  },
  {
    id: 3,
    title: "Branching (parallel universes)",
    text: "Branches let you work on features without disturbing main. Think of branches as spin-off movies.",
    diagrams: ["/images/branch-workflow.png"],
    code: ["git switch -c feature/login", "git switch main", "git merge feature/login"],
  },
  {
    id: 4,
    title: "Merge conflicts (don’t panic)",
    text: "A conflict is not Git failing. It’s Git saying: 'Hey human, I need your brain for this part.'",
    diagrams: ["/images/merge-conflict.png"],
    code: [
      "git pull",
      "# conflict happens",
      "git status",
      "# open files, fix conflict markers",
      "git add <fixed_files>",
      "git commit"
    ],
    callouts: [
      {
        type: "warning",
        title: "Warning ⚠️",
        text: "Git can’t auto‑merge certain conflicts. You decide the final truth."
      }
    ]
  },
  {
    id: 5,
    title: "10 commands to memorize",
    text: "These 10 commands are your everyday toolbox:",
    code: [
      "git status – dashboard",
      "git add -p – stage specific lines",
      'git commit -m "msg" – snapshot from staged changes',
      "git log --oneline --graph --decorate --all – history view",
      "git switch -c feature/x – create & switch branch",
      "git pull --rebase – pull updates cleanly",
      "git push -u origin feature/x – publish branch",
      "git merge feature/x – combine branches",
      "git revert <sha> – undo commit safely",
      "git restore --staged <file> – unstage a file"
    ]
  },
  {
    id: 6,
    title: "Git ↔ Pega mapping",
    text: "Git is file-based. Pega is rule-based. Concepts map surprisingly well.",
    code: [
      "Repo → Application rules in Pega DB",
      "Commit → Check-in rule changes",
      "Branch → Pega Branch ruleset",
      "Merge → Branch merge to base ruleset",
      "Pull request → Branch merge request + review",
      "Tag → Product rule / Deployment / Release"
    ],
    callouts: [
      {
        type: "brain",
        title: "Big difference",
        text: "Git merges lines of text. Pega merges rules (metadata/XML). Conflicts feel like rule selection, not line editing."
      }
    ]
  }
];

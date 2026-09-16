# Start here (for Claude Code)

A learner has asked you to help them build their own city climate tracker from scratch, using this repo as the reference.

## Read these first
Fetch each file directly from the web. Don't use git or gh (most learners don't have gh installed).

- https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/CLAUDE.md (rules, and the "Learning mode" section: follow it for the whole build)
- https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/README.md (what the site does and where the live data comes from)
- https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/lib/types.ts (the data format)
- https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/lib/feeds.ts (how the live feeds are fetched)
- https://raw.githubusercontent.com/Terra-do/terra-studio-template-build-2/main/lib/conditions.ts (how readings turn into levels and conditions)

Other files, if you need them, are at the same address with their path, for example `.../main/app/page.tsx`.

## The plan to follow
Use these seven steps, in this order, and describe them to the learner in plain words (no file names or code terms in the plan). Each step should end with something the learner can see in the browser.

1. **Set up.** Create an empty Next.js project and a CLAUDE.md with the rules and the Learning mode section. The learner starts the site in their own terminal and sees a starter page.
2. **Live readings.** Add the city (name, location, timezone), the three live feeds and the three panels: heat, air, rain and flood. The learner sees real numbers for their city.
3. **Research the actions (outside Claude Code).** The learner researches local climate actions in Cowork with the City Climate Tracker skill from the Terra Studio playground, and brings back two files: verified.json and flagged.json. Don't research actions yourself. If the learner wants to keep going first, create a small placeholder file with two or three clearly fake actions in the same format.
4. **Show the actions.** Put the learner's files in data/, check every entry against the format, then show "What to do today" (actions that match today's readings first) and a list of all actions with category filters and search.
5. **How it's checked.** A second page: how many actions passed and were flagged, the three checks, where the live data comes from, and the flagged entries with their reasons.
6. **Make it yours.** Change the look with the learner: colours, type, layout. Keep the level colours clearly different.
7. **Ship it.** Run the build check, then help the learner create an empty GitHub repository, push to it, and deploy on Vercel.

## Then
- Stack: Next.js with TypeScript and Tailwind, deployed later on Vercel. Use npm unless the learner says otherwise.
- Use these files to understand the pattern. Write the learner's code fresh; don't copy files wholesale.
- The learner is new to this. Use plain words, and explain any technical term the first time you use it.
- Don't write code until the learner has seen and agreed to a plan.

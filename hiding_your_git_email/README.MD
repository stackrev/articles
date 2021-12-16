# Public Git Commits might leak you Data.

Specifically your personal email. 

In git, to upload your code, you need some form of identification usually in the form of an email and/or username. 
In the gitbash, you set it up like so:

```bash
git config --global user.email dummy@dummymail.com
git config --global user.name dummyuser
```

You can list this info `git config --list` or go to the _~/.gitconfig_ file to see these:
```bash
[user]
        email = ummy@dummymail.com
        name = dummyuser
```

Both these peices of data link to your github/bitbucker account and attribute your actions to your account.

When you add your code and then commit, this information is stored in the git log.
If you run the command: `git log`, this is what you see:


## Sneaky Scrapes

When I set my github account, I made sure none of that my profile doesn't show my email.
But some sneaky private data aggregator managed to get this email, and spam me with their solicitations for whatever software development products they offered.

How did they do it - they crawled through all public repos and ran this command:

`git log --format='%ae' | sort -u`

Running this command, this it what it shows, smart of them:




With this in mind let's protect ourselves.

## Obfuscate your commits

Github offer us tools to hide our info.

Go to your [profile settings](https://github.com/settings/emails). In this page you will see these 2 options:

- **Keep my email addresses private**: Github creates dummy emails for you. This we will use later.
- **Block command line pushes that expose my email**: Makes sure you do not push any private information.

Enabling the above will require changes to our gitbask.  We need to set our email to the random email created using `git config --global user.email`



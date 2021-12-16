# You Git Commits might leak your data

Specifically your personal email. In git, to upload your code, you need some form of identification usually in the form of an email. 
In the gitbash (or .gitrc) you set it up like so:

```bash
git config --global user.email dummy@dummymail.com
git config --global user.name dummyuser
```
Both these peices of data link to your github/bitbucker account and attribute your actions to your account.

Git commits expose your email:
Now that you have set up the Git CLI, you must have committed your code and pushed it to a public repository, all the git commits will have the following information:

Commit Hash
Author name <Email Address>
Date and time
Commit Message

Git Commits exposing private email addresses

Even though the Web interface of Github doesn’t show the private email address, one can clone the public repository and run git log to view the commit history and there your private email addresses are exposed!



To get all the emails from git log, you can use this one-liner (in Linux / Git Bash):

STEPS:

Clone the Github repository 
cd into the cloned repository
Run the one-liner:
git log | grep Author | cut -d ":" -f2 | sort -u | awk '{print $NF}' | sed -r 's/<// ; s/>//'
How to Protect?
To protect the private email addresses from being exposed in your commits, you must configure Github settings as well as Git CLI.

1. Github Settings:
Github provides two options to protect your private email addresses from being exposed. Go to Your Profile -> Emails and enable these options:

Keep my email addresses private.
Block command line pushes that expose my email.

Github Settings

Note: The above options may differ in Bitbucket, Gitlab and other code hosting platforms.

2. Changes in Git CLI:
By enabling the second option in Github settings, any further commit which contains your private email address will be blocked. Now you have to configure the Git CLI to not include your private email address.

You can use any random email id like email@example.com. But the problem is that your commits won’t be attributed to you!
Alternatively, Github provides a dummy email id (highlighted in the previous image), which ensures that commits are attributed to you and appear in your contributions graph.
Any commits you made prior to changing your commit email address are still associated with your previous email address. You must delete your whole commit history to get rid of that email address.

Change the email address using the git command:

git config --global user.email <dummy-github-email>

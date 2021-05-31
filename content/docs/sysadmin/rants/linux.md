---
title: "Linux Desktop Is a Shit Show"
date: 2021-03-01T21:01:45+05:30
lastmod: 2021-03-01T21:01:45+05:30
---

# Doing The Unusual — Criticising Linux
These are the collection of my gripes and frustrations I'm either facing right now, or have faced in
the past, when using the Linux, or GNU/Linux if you will, on the desktop. I've been using Linux on
my desktop exclusively since 2015 instead of Windows 10 or MacOS.

For people out there who're pedantic and radicalized enough to miss the point of the article, this
isn't just about the Linux kernel itself but about using Linux ecosystem on a desktop. I don't think
you can use the Linux kernel itself on your desktop to do anything meaningful.

People on Reddit and other online communities see Linux as this perfect panacea of user freedom,
customization, and power. The shilling never stops and unsuspecting users are led to believe that
Microsoft and Apple are sitting on their asses and doing nothing on their desktops while a community
of open source developers are doing something better. They fail to mention things like Linux is
still stuck with the ancient display server called Xorg which [has been called a security
circus](https://blog.invisiblethings.org/2011/04/23/linux-security-circus-on-gui-isolation.html),
Wayland is NOT a daily driver yet (as on April 2021) even if a prominent developer calls people who
can't use Wayland as [anti vaxxers](https://drewdevault.com/2021/02/02/Anti-Wayland-horseshit.html).
I mean, VSCode doesn't work as expected on Wayland yet. It runs on XWayland and becomes blurry if
you do fractional scaling, which has become pretty much ubiquitous. Is every dev out there who
doesn't use Wayland because of this an anti-vaxxer?

# Arguments Made By Linux Enthusiasts

Oh, one of the most widely used counter arguments that you'll come across when criticising Linux or
OSS is this

> In the case of Wayland, the “vague authority” are a bunch of volunteers who have devoted tens of
> thousands of hours of their free time towards making free shit for you.

Linux and OSS defenders will say, *"Hey, they're making it free. Either be grateful or fuck off. You
don't get to complain asshole."* If only they said this on their websites or when raving about it
everywhere. *"It works perfectly for me. But if it doesn't work for you after you devote hundreds of
hours installing it and learning it, fuck you. You don't get to complain."*

> Maybe Wayland doesn’t work for your precious use-case. More likely, it does work, and you
> swallowed some propaganda based on an assumption which might have been correct 7 years ago.

I guess VSCode not working for me and being blurry on my 4k monitor with fractional scaling is
propaganda. Apparently, some people's jobs and livelihood depend on this but no, Linux and OSS
defenders will pretend that your problems are a niche use case that no one cares about. Besides, you
should just be using (neo)vim or emacs instead of VSCode anyways.

> We’ve sacrificed our spare time to build this for you for free. If you turn around and harass us
> based on some utterly nonsensical conspiracy theories, then you’re a fucking asshole.

If you go around proselytizing Wayland and sway or some other OSS software and call it "stable" and
"ready for daily use" and then basic shit like VSCode and Firefox doesn't work as expected, perhaps
you're the asshole for wasting people's time by baiting them to switch from their established
workflows.

Since the praise for Linux, and criticism for anyone who speaks otherwise, never stops and no one
bothers to highlight serious issues with the Linux desktop, this is my attempt to do so.

# List of Issues

## Not Fixed Yet

- suspend and resume have been buggy and broken on my Intel Haswell desktop since the past **2+**
  years and on my Thinkpad E495 AMD Ryzen 3500U laptop since I bought it

  There's no guarantee that my desktop or laptop will come back online if I suspend them. Well, the
  system does come online but the screen remains turned off and the CPU usage often spikes to 100%.
  I have no option at that point but to reboot forcibly and lose any potential data. When I asked
  for help on the Arch forums, I was told to stop whining and compile my own kernel with patches
  found on gitlab which the dev himself called hacks.

  Let's see how many years it takes for this bug to be fixed. I'll keep adding logs whenever I face
  an unsuccessful resume.

  If anyone's interested, [here](https://paste.ack.tf/110212) are the logs after an unsuccessful
  resume and [here's](https://paste.ack.tf/30e9c0) one with a successful resume with kernel version
  5.10.23.

- my system keeps crashing randomly

  Seriously, I can't reproduce it but it happens enough that I sometimes want to flip my table. I
  tried using the LTS kernel 5.10.23 to 5.10.41 but that's basically broken. I get stack traces,
  page faults, and system freezes almost everyday. This also happened in 5.11.x but lesser than
  5.10.x. Switching to 5.12.x made this problem infrequent but it's still there.

  [Here](https://paste.ack.tf/d5db46) are logs with kernel version 5.12.6.

  [Here](https://paste.ack.tf/715fcc) are logs with kernel version 5.12.8.

  I don't know but this looks like a AMDGPU issue to me. People rave about how Nvidia is bad for
  Linux and how AMD is good because they have open source drivers and how everything works
  "perfectly" for them but apparently, basic functionalities like suspend and resume is broken and
  your system will keep crashing randomly in the middle of work.

  Should I restrict my purchases to Intel only in the future? I asked around and people said that
  the same problem exists for them on their Intel laptops for as long as they can remember.

- (neo)vim uses its own ancient spelling dictionaries and, apparently, you can't use hunspell or
  nuspell with it

  People are [bickering](https://github.com/neovim/neovim/issues/356) about replacing apparently the
  second biggest source code file in Vim, known as `spell.c`, instead of coming up with a solution.
  Meanwhile, if you activate (neo)vim's spell check right now, it'll show `aren't` and `didn't` as
  spelling mistakes.

- (neo)vim can't do syntax highlighting correctly, even with plugins, for a lot of things including
  gitconfig files and markdown documents.

  The markdown syntax highlighting library from plasticboy is abandoned and full of bugs. I tried
  using vim-pandoc-syntax along with its syntax package and that turned out to be similarly buggy
  and extremely slow.

  [Here's](https://asciinema.org/a/uMlSQOG67IxQFyTHx1zHSTzrK) a preview of what I'm talking about
  when using vim-pandoc. [The same issue](https://asciinema.org/a/51LqtMV3ZNl64EGxI2Q5eJFSL) happens
  with vim-markdown.

  When people rave about vim, they should mention that if you want to do common stuff like write
  documentation using markdown, you'll be disappointed.

  Although there are ongoing efforts to integrate tree-sitter in neovim, I'm not sure how they'll
  work out. I know, I know, you're using neovim 0.5.0 nightly and it works "perfectly" for you and
  it has zero bugs and it can launch humans into space and all that shit. I'm not interested.

- sometimes, pop up menus in Firefox [aren’t](https://github.com/swaywm/sway/issues/6147) visible
  after I right click on something

  This is incredibly annoying. Sometimes I end up clicking something which I didn’t intend to.

- apparently, some websites will tell you that the NERDTree plugin made for (neo)vim is bloat and
  you should just use the built in `netrw` instead. I guess they fail to mention bugs like
  [this](https://github.com/tpope/vim-vinegar/issues/13). Hey, for all I know, NERDTree is indeed
  bloat and shitty.

- [17th May 2021] Since the past few weeks, my Thinkpad E495 with AMD 3500U CPU keeps
  [crashing](https://bugzilla.kernel.org/show_bug.cgi?id=201957) in the middle of my work and I have
  to do hard reboots. This is most probably an [AMDGPU
  issue](https://bbs.archlinux.org/viewtopic.php?id=266358), going back all the way to 2018 or maybe
  earlier. But hey, I'm not supposed to complain.  What's more, if you do complain, people will just
  say "it works like a charm for me" and try to make it either your fault or say that your hardware
  is faulty.

## Fixed After Considerable Distress

- when I upgraded to Firefox 87, I experienced [intense
  flickering](https://bugzilla.mozilla.org/show_bug.cgi?id=1694967) on pop menus

  Although this issue has been fixed in sway version 1.6, I had to downgrade and keep Firefox at
  version 86 for almost a month after version 87 was released.

- when waking up my laptop from sleep, Firefox almost always became blurry

  This happened with fractional scaling enabled. Someone on Reddit told me that this was because of
  [this](https://github.com/swaywm/wlroots/issues/2466) bug. I’ve been saving my session and
  restarting Firefox each and every time I came back home, resumed my laptop back from sleep, and
  tried to start doing my work. Apparently, this issue might’ve been fixed in sway 1.6 but I’ve been
  dealing with this for many weeks now.

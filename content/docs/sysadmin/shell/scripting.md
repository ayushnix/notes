---
title: "Shell Scripting"
weight: 1
date: 2021-01-03T19:02:52+05:30
lastmod: 2021-01-03T19:02:52+05:30
---

# Introduction

Knowing how to use your shell and being able to write scripts that work across
different Unix-like operating systems can be an incredibly important skill.
I've often thought about it as an essential skill that a sysadmin should
possess. However, there are various complications when it comes to using shell
scripts.

- although bash is the most popular shell out there, it isn't the standard shell
  used across all Unix-like systems

  Debian uses dash as its `/bin/sh` and Alpine, used widely in containers, uses
  BusyBox which uses its own version of
  [ash](https://en.wikipedia.org/wiki/Almquist_shell). There's `tcsh` used by
  FreeBSD and `pdksh` used by OpenBSD. Needless to say, there are syntactical
  differences between all of them although scripts written in POSIX sh should
  probably run reliably across all of these platforms.

- shell scripts do not have robust error handling features and they can't handle
  edge cases you didn't think about

  Drew DeVault wrote a [blog
  post](https://drewdevault.com/2020/12/12/Shell-literacy.html) about becoming
  shell literate. A guy on HN rightfully [pointed
  out](https://news.ycombinator.com/item?id=25402003) the flaws in the
  operation[^1].

  [Here's](http://typingducks.com/blog/bash/) a blog post about issues when
  using shell scripts.

However, if you know what you're doing, shell scripting using POSIX sh or
bash[^2] can be an incredibly powerful tool in your repertoire. You may or may
not have access to Python or Perl in your Unix-like platform or in your
container but you will always have a shell.

We'll talk about POSIX `sh` first and then we'll move on to features specific to
`bash`. In case your `/bin/sh` is symlinked to `bash`, install
[dash](https://git.kernel.org/pub/scm/utils/dash/dash.git). There's also
[mksh](http://www.mirbsd.org/mksh.htm#otheros) which seems to be POSIX compliant
and is also used on Android.

## Linter, Formatter, and Testing

Before we get started with bash shell scripting, install
[shellcheck](https://github.com/koalaman/shellcheck).

We'll also use [shfmt](https://github.com/mvdan/sh) to follow a specific style
guide and stick to it. I'm using `-i 2 -ci -sr -bn` options with `shfmt`.
You'll need a plugin like [ALE](https://github.com/dense-analysis/ale) or
[neomake](https://github.com/neomake/neomake) to use shellcheck and shfmt on
neovim.

I'm not sure if [bats](https://github.com/bats-core/bats-core) is helpful.
There's also [shellspec](https://github.com/shellspec/shellspec).

## Shell Strict Mode

[This](http://redsymbol.net/articles/unofficial-bash-strict-mode/) blog post,
for better or worse, seems to have popularized strict mode in shell scripting.

### set -e

First, we have `set -e`. It's supposed to exit immediately whenever there's an
error in a script. However, this doesn't always work as expected. It's not just
about `set -e` not being able to detect certain class of errors. In that case,
using it would've been fine. But, `set -e` introduces false positives and exits
when we may not intend to.

```sh
set -eu

count=$(grep -c some-string /usr/bin/pass) # script execution aborts here

if [ "${count}" -ne 0 ]; then
  printf '%s\n' "something found"
else
  printf '%s\n' "nothing found"
fi
```

In this case, if `grep` fails to find any match, the exit code becomes non-zero.
However, that's fine, because we intend to use it as a test case. But using `set
-e` aborts execution.

There are [plenty](http://typingducks.com/blog/bash/) of other
[examples](https://mywiki.wooledge.org/BashFAQ/105) of unintended behavior when
using `set -e`.  As a result, **we WON'T be using** `set -e` in our scripts.

### set -u

### set -o pipefail

{{< hint warning >}}
`set -o pipefail` doesn't work on POSIX sh
{{< /hint >}}

The exit status of a pipeline is the exit status of the last command in the
pipeline unless `set -o pipefail` is enabled in which case the exit status is
that of the command which fails first.

### set -C

We might wanna use `set -C` to prevent accidental overwriting of files. It'd be
better to adopt the practice of creating files separately instead of using `>`
to create files as well.

### trap



## Style Guide

[Google's Shell Style
Guide](https://google.github.io/styleguide/shellguide.html) should serve as a
good reference but we may not follow everything written there. Using `shfmt`
should help as well.

### General Recommendations

1. the following format may be adopted when writing shell scripts

     ```sh
     #!/bin/sh
     #
     # BRIEF DESCRIPTION OF WHAT THE SCRIPT DOES
     #
     # AUTHOR AND COPYRIGHT INFORMATION IF NEEDED
     <actual code>
     ```
2. prefer using built-in methods rather than external programs

   `sh`, and particularly `bash`, have a lot of built-in methods that might make
   using external programs unnecessary. Using built-in methods reduces
   dependencies and makes your code much faster.

   A simple example would be using built-in parameter expansions rather than
   `sed`/`awk` for trivial data manipulation tasks.

3. use `#!/bin/sh` (or `#!/bin/bash`, if you need to write shell scripts with
   bash-isms) as the shebang

   If a platform doesn't have `/bin/sh` or `/bin/bash` (NixOS, BSDs), adapt your
   scripts accordingly at the time of installation.

   Although `#!/usr/bin/env sh` is better for portability, we'll prefer not to
   use it. You can't pass arguments in this form and using it allows the
   possibility of using arbitrary binaries available in `PATH`. I guess one has
   bigger problems to worry about if the `PATH` on his system can't be trusted.

4. use `"${var}"` instead of `"$var"` — the exception to this rule is when using
   positional parameters like `"$1"` or special parameters like `"$@"`

5. when using `if-then-else`, the `then` block should preferably contain things you want
   happening if everything's good rather than error responses

   consider this block of code and execute it

   ```sh
   #!/bin/bash

   # pass isn't defined deliberately or assume that pass has some invalid
   # characters like non-alphanumeric characters

   if [ "$pass" -ge 100 ]; then
     echo "success"
   else
     echo "failed"
   fi

   if [ "$pass" -lt 100 ]; then
     echo "failed"
   else
     echo "sucess"
   fi
   ```

   although both constructs are logically the same, the 2nd construct turns out
   to be problematic because the else block is executed

### Avoid This

1. `&> fille` and `|& tee`

2. `select` — just use a combination of `while`, `read`, `case`, and `if`
   instead

3. `until` loop

4. `$'...'` ANSI C style quotes

5. `;&` and `;;&` terminators in `case`

6. `function` keyword to define functions

# POSIX sh

# bash
## Control Operators

`command1 && command2` causes `command2` to be executed only if `command1` exits
successfully.

`command1 || command2` causes `command2` to be executed only if `command1`
fails.

`! command` is true if `command` is false

## Redirections

The following table depicts the effect of redirection and piping to a file.

`stdin` has the file descriptor `0`.

| syntax           | terminal stdout | terminal stderr | file stdout | file stderr | effect on file |
| ---------------- | --------------- | --------------- | ----------- | ----------- | -------------- |
| `>`              | no              | yes             | yes         | no          | overwrite      |
| `>>`             | no              | yes             | yes         | no          | append         |
| `2>`             | yes             | no              | no          | yes         | overwrite      |
| `2>>`            | yes             | no              | no          | yes         | append         |
| `> file 2>&1`    | no              | no              | yes         | yes         | overwrite      |
| `>> file 2>&1`   | no              | no              | yes         | yes         | append         |
| `\| tee`         | yes             | yes             | yes         | no          | overwrite      |
| `\| tee -a`      | yes             | yes             | yes         | no          | append         |
| `2>&1 \| tee`    | yes             | yes             | yes         | yes         | overwrite      |
| `2>&1 \| tee -a` | yes             | yes             | yes         | yes         | append         |

You might wonder about the difference between `> file 2>&1` and `2>&1 > file`.
In the first case, you won't get any output on the terminal and both stdout (1)
and stderr (2) are redirected to `file`. However, in the 2nd case, stderr is
still shown on the terminal.

For understanding the meaning behind `a>&b`, read this as `a` is now pointing
wherever `b` is pointing at the moment. Also, `a` won't stop pointing wherever
`b` was pointing to if `b` starts pointing anywhere else.

This implies that `> file 2>&1` means that point stdout to `file`, and also
point stderr to wherever stdout is pointing to (which is `file`). Similarly,
`2>&1 > file` implies that point stderr to wherever stdout is poiting to (which
is the terminal at this point) and then point stdout to `file`. stderr will
still keep pointing to the terminal though.

[Here's](https://catonmat.net/ftp/bash-redirections-cheat-sheet.pdf) a
cheatsheet that'll help as well. A series[^3] of blog posts have been written as
well.

## Here Documents

You might've come across segments of code such as

```sh
var=1

cat << EOF
first line
second line
third line
this is a $var
EOF

cat << 'EOF'
first line
second line
third line
this is a $var
EOF

cat << 'EOF' | sed 's/a/b/' | tee /tmp/foobar
foo
bar
baz
EOF

if true; then
  cat <<- EOF > /tmp/yourfilehere
	The leading tab is ignored.
	EOF
fi
```

These are called **here documents**. The first form will expand the `$var` and
the second form won't. The third form is meant to demonstrate that the output
can be redirected to another command. The final form is used for stripping
leading tab characters in cases when here documents are indented for readability
purposes.

## Conditional Constructs

### Conditional Expression

The conditional expression `[[ <expression> ]]` returns a value of 0 or 1
depending on the evaluation of the expression inside.

A list of common tests you can do inside `[[ ... ]]` are

| Operator Syntax        | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| `-e file`              | TRUE, if file exists                                               |
| `-f file`              | TRUE, if a regular file exists                                     |
| `-d file`              | TRUE, if a directory exists                                        |
| `-r, -w, -x file`      | TRUE, if read, write, executable permissions exist                 |
| `-s file`              | TRUE, if size of the file is greater than 0 (not empty)            |
| `file1 -nt file2`      | TRUE, if file1 is newer than file2; use `-ot` for the antonym      |
| `-z string`            | TRUE, if string is empty                                           |
| `-n string`            | TRUE, if string is not empty                                       |
| `string1 == string2`   | TRUE, if string1 matches the **pattern** in string2                |
| `string1 == "string2"` | TRUE, if string1 literally matches string2                         |
| `string1 != string2`   | TRUE, if string1 doesn't match the **pattern** in string2          |
| `string1 =~ string2`   | TRUE, if string1 matches the extended regex pattern in string2     |
| `string1 < string2`    | TRUE, if string1 sorts before string2                              |
| `int1 -eq int2`        | TRUE, if both integers are identical; `-ne` for the antonym        |
| `int1 -lt int2`        | TRUE, if int1 is less than int2; `-gt` for the antonym             |
| `int1 -le int2`        | TRUE, if int1 is less than or equal to int2; `-ge` for the antonym |

```sh
FILE="/home/triton/.bashrc"
REGEX='\/[a-z]*\/[a-z]*'
A=1
B=2

if [[ -f "${FILE}" ]]; then
  printf '%s\n' 'exists!'
fi

# no reason not to use quotes here as well when writing variables
if [[ "${A}" -eq "${B}" ]]; then
  printf '%s\n' 'equals!'
else
  printf '%s\n' 'not equal'
fi

# notice the difference between the following if-else statements
# in the 1st case, "${FILE}" matches against a pattern
# in the 2nd case, "${FILE}" matches against an exact string
if [[ "${FILE}" == \/[a-z]* ]]; then
  printf '%s\n' 'matches'
else
  printf '%s\n' 'does not match'
fi

if [[ "${FILE}" == "\/[a-z]*" ]]; then
  printf '%s\n' 'matches'
else
  printf '%s\n' 'does not match'
fi

# it's better to use regexes and specifying the regexes in a separate variable

# the in-built BASH_REMATCH array variable records the part of the string that
# matched the regex

if [[ "${FILE}" =~ $REGEX ]]; then
  printf '%s\n' 'matches'
else
  printf '%s\n' 'does not match'
fi

echo "${BASH_REMATCH[@]}"
```

### if then else

```sh
MOZ_ENABLE_WAYLAND=1

if [[ "${MOZ_ENABLE_WAYLAND}" -eq 1 ]]; then
  printf '%s\n' 'firefox will run natively in wayland'
else
  printf '%s\n' 'firefox will run in xorg'
fi

if grep ^triton: /etc/passwd > /dev/null 2>&1; then
  printf '%s\n' 'triton is orbiting neptune'
else
  printf '%s\n' 'triton has become a rogue satellite'
fi

if ! mount | grep -i borg >/dev/null 2>&1; then
  printf '%s\n' 'FATAL: borg backup does not exist' >&2
  exit 1
else
  printf '%s\n' 'borg backup exists and is mounted'
fi

printf '%s\n' 'enter a number'
read -r n

if [[ "${n}" -eq 1 ]]; then
  printf '%s\n' 'value of n is 1'
elif [[ "${n}" -eq 2 ]]; then
  printf '%s\n' 'value of n is 2'
else
  printf '%s\n' 'value of n is other than 1 and 2'
fi
```

### case

The `elif` clause can be written multiple times. However, if you find yourself
writing multiple `elif` clauses, it's better to use `case`.

```sh
printf '%s\n' 'locale?'
read -r LANG

case $LANG in
  en*) printf '%s\n' 'Hello!' ;;
  fr*) printf '%s\n' 'Salut!' ;;
  de*) printf '%s\n' 'Guten Tag!' ;;
  nl*) printf '%s\n' 'Hallo!' ;;
  it*) printf '%s\n' 'Ciao!' ;;
  es*) printf '%s\n' 'Hola!' ;;
  C | POSIX) printf '%s\n' 'hello world' ;;
  *) printf '%s\n' 'I do not speak your language.' ;;
esac

printf '%s\n' 'enter a number'
read -r num

case "${num}" in
  '' | *[!0-9]*) printf '%s\n' 'input is not a number' ;;
  *) printf '%s\n' 'you have entered a number' ;;
esac
```

## Looping Constructs

```sh
count=10
i=20
ucount=20
j=10
array=("1" "2" "3" "4" "5")
# while loop
while [[ $i -gt $count ]]; do
  printf '%s\n' "$i"
  i=$((i - 1))
done

# while loop with negation - use this instead of 'until' loop
while ! [[ $j -gt $ucount ]]; do
  printf '%s\n' $j
  j=$((j + 1))
done

# for loop - 1st form
for k in "${array[@]}"; do
  printf '%s\n' "$k"
done

# for loop - arithmetic expression
for ((l = 1; l < 10; l++)); do
  printf '%s\n' "$l"
done
```

In the case of for loops with the arithmetic expression form, if any of the
expressions is omitted, it evaluates to 1.

In all of these loops, the exit status is the last command executed in the loop.

The `break` and `continue` builtin commands maybe used to control loop
execution.

## Group Commands

We can group, and execute, multiple commands using either `(list)` or `{ list;
}`.

The former grouping method, `(list)`, creates a subshell. Anything that affects
the environment, variables, `cd` etc., aren't reflected outside the subshell.

```sh
FILE=sample

{ echo $FILE; }

{
  echo "$FILE"
  echo "he finally got it"
}

(
  # will be successful
  echo $FILE
  FILE1=sample1
  # will be successful
  echo $FILE1
)

# will NOT be successful
echo $FILE1
```

## Functions

Functions, as one might expect, make the code more readable and allow us to
reuse code blocks with slightly different arguments.

```sh
open() {
    case "$1" in
        *.mp3|*.ogg|*.wav|*.flac|*.wma) mpv "$1";;
        *.jpg|*.gif|*.png|*.bmp)        gwenview "$1";;
        *.avi|*.mpg|*.mp4|*.wmv)        mpv "$1";;
    esac
}
for file; do
    open "$file"
done
```

When a function is executed, the arguments given become positional parameters.
The name of the function is the first element of `FUNCNAME` while the function
is executing.

## Parameters



## Builtin Commands

Several built-in commands are used to assist in declaration, I/O, control, and configuration.

### Declaration Commands

- `declare`
- `local`
- `set` and `unset`
- `shift`
- `readonly`
- `eval`
- `export`

### I/O

- `read`
- `mapfile`
- `coproc`
- `printf`
- `echo`

### Misc

- `exec`
- `trap`
- `wait`

## Builtin Shell Variables


---

https://wiki.ubuntu.com/DashAsBinSh

[^1]: C'mon, who uses white spaces in file and directory names in Linux? Okay,
I know I don't but not everyone is averse to using white spaces in file and
directory names, especially people who come from a Windows background.

[^2]: You can still write sh compatible scripts while using bash if you use `set
-o posix`. Or, just install dash, symlink `/bin/sh` to it, and use
`#!/bin/sh`.

[^3]: [Part 1](https://catonmat.net/bash-one-liners-explained-part-one), [Part
2](https://catonmat.net/bash-one-liners-explained-part-two), and [Part
3](https://catonmat.net/bash-one-liners-explained-part-three).

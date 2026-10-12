# GitHub Multi-Account Setup Guide

## Default Account
**`github.com` (Work Account - sinanm247)** is the DEFAULT account.

When you use `git@github.com:username/repo.git`, it will use the **work account** automatically.

---

## Account Summary

| Account | SSH Host | Username | Email | Use Case |
|---------|----------|----------|-------|----------|
| **Work (DEFAULT)** | `github.com` | sinanm247 | (work email) | Default for all repos |
| **Work (Explicit)** | `github.com-work` | sinanm247 | (work email) | Same as default, explicit |
| **Personal** | `github.com-personal` | sinansinu07 | (personal email) | Personal projects |
| **Freelance** | `github.com-freelance` | wecandeveloper | (freelance email) | Freelance projects |
| **City Doctor** | `github.com-citydoctor` | developercitydoctor | developer.citydoctor@gmail.com | City Doctor projects |

---

## How to Commit & Push for Each Account

### 1. Work Account (DEFAULT - sinanm247)

**For NEW repositories:**
```bash
# Clone using default (work account)
git clone git@github.com:sinanm247/repo-name.git

# Or set remote
git remote add origin git@github.com:sinanm247/repo-name.git

# Set git config (if not set globally)
git config user.name "sinanm247"
git config user.email "your-work-email@example.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push -u origin main
```

**For EXISTING repositories:**
```bash
# Just commit and push (uses default account)
git add .
git commit -m "Your commit message"
git push
```

---

### 2. Personal Account (sinansinu07)

**For NEW repositories:**
```bash
# Clone using personal account
git clone git@github.com-personal:sinansinu07/repo-name.git

# Or set remote
git remote add origin git@github.com-personal:sinansinu07/repo-name.git

# Set git config
git config user.name "sinansinu07"
git config user.email "your-personal-email@example.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push -u origin main
```

**For EXISTING repositories:**
```bash
# Update remote if needed
git remote set-url origin git@github.com-personal:sinansinu07/repo-name.git

# Set git config
git config user.name "sinansinu07"
git config user.email "your-personal-email@example.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push
```

---

### 3. Freelance Account (wecandeveloper)

**For NEW repositories:**
```bash
# Clone using freelance account
git clone git@github.com-freelance:wecandeveloper/repo-name.git

# Or set remote
git remote add origin git@github.com-freelance:wecandeveloper/repo-name.git

# Set git config
git config user.name "wecandeveloper"
git config user.email "your-freelance-email@example.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push -u origin main
```

**For EXISTING repositories:**
```bash
# Update remote if needed
git remote set-url origin git@github.com-freelance:wecandeveloper/repo-name.git

# Set git config
git config user.name "wecandeveloper"
git config user.email "your-freelance-email@example.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push
```

---

### 4. City Doctor Account (developercitydoctor)

**For NEW repositories:**
```bash
# Clone using City Doctor account
git clone git@github.com-citydoctor:developercitydoctor/repo-name.git

# Or set remote
git remote add origin git@github.com-citydoctor:developercitydoctor/repo-name.git

# Set git config
git config user.name "developercitydoctor"
git config user.email "developer.citydoctor@gmail.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push -u origin main
```

**For EXISTING repositories:**
```bash
# Update remote if needed
git remote set-url origin git@github.com-citydoctor:developercitydoctor/repo-name.git

# Set git config
git config user.name "developercitydoctor"
git config user.email "developer.citydoctor@gmail.com"

# Commit and push
git add .
git commit -m "Your commit message"
git push
```

---

## Quick Reference Commands

### Check Current Configuration
```bash
# Check which account is configured for current repo
git config user.name
git config user.email
git remote -v
```

### Switch Account for Existing Repo
```bash
# 1. Update remote URL (change the SSH host)
git remote set-url origin git@github.com-ACCOUNT:username/repo-name.git

# 2. Update git config
git config user.name "username"
git config user.email "email@example.com"

# 3. Verify
git remote -v
git config user.name
```

### Test SSH Connection
```bash
# Test each account
ssh -T git@github.com              # Work (default)
ssh -T git@github.com-personal     # Personal
ssh -T git@github.com-freelance    # Freelance
ssh -T git@github.com-citydoctor   # City Doctor
```

---

## Important Notes

1. **Default Account**: `github.com` (work account) is used when you don't specify a host alias
2. **SSH Host Alias**: The part after `git@` and before `:` determines which account/key is used
3. **Local Git Config**: Each repository can have its own `user.name` and `user.email` (set with `git config` without `--global`)
4. **Global Git Config**: If you want a default for all repos, use `git config --global user.name` and `git config --global user.email`

---

## Current Project Setup (Work Account – sinanm247) ✅

This project is configured for:
- **Account**: sinanm247 (Work – default)
- **Remote**: git@github.com:sinanm247/media247-outdoor-landing-page.git

To commit and push:
```bash
git add .
git commit -m "Your commit message"
git push -u origin main
```


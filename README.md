# Discord System-Wide Overlay Enhancement

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Proposal-orange)](https://github.com)

## 🎯 Overview

This repository contains a comprehensive proposal and proof-of-concept implementation for enhancing Discord's overlay system to work system-wide, not just in games.

### The Problem
Discord's overlay currently only works in detected games, limiting its usefulness for remote workers, educators, and content creators who want to see who's talking during ANY activity.

### The Solution
Add user-configurable overlay modes:
- **Games Only** (current default)
- **All Applications** (system-wide)
- **Desktop Mode** (hotkey-activated)
- **Custom Whitelist** (user-defined apps)

## 📚 Documentation

See [PROPOSAL.md](./PROPOSAL.md) for complete technical documentation.

## 🚀 Quick Start
```bash
# Clone the repository
git clone https://github.com/tiupanca/discord-overlay-enhancement.git
cd discord-overlay-enhancement

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## 🎓 For Discord Team

This is a **community-driven proposal** with working proof-of-concept code. I'm available for:
- Technical discussion
- Code review
- Integration planning
- Beta testing

## 📖 Key Features

✅ Backward compatible - no breaking changes  
✅ User-controlled - opt-in feature  
✅ Secure - includes security blacklist  
✅ Performant - < 2% CPU overhead  
✅ Well-documented - comprehensive tests and docs

## 📞 Contact

- GitHub: [@tiupanca](https://github.com/tiupanca)
- Discord: russell.bufalino
- Email: alsobox@hotmail.com

## 📜 License

MIT License - See [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

This proposal addresses a highly-requested feature (1000+ community upvotes). Special thanks to the Discord community for inspiration and feedback.

---

**Note**: This is an independent proposal. I am not affiliated with Discord Inc. This code is provided as a reference implementation to demonstrate the feasibility and value of this feature.
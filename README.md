# Portuguese High School Math Performance Analysis

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Project Overview

This interactive data story analyzes the UCI Student Performance dataset (395 students, 33 variables) to understand what factors most influence final math grades (G3, scale 0-20). The analysis is structured around three research questions:

1. **Academic Engagement**: Study habits, past failures, grade trajectories
2. **Family & Demographics**: Parental education, support systems
3. **Lifestyle Choices**: Alcohol consumption, social activities (analyzed via PCA)

A decision tree synthesizes findings to reveal the hierarchical importance of predictors.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/math-performance-analysis.git
cd math-performance-analysis

# Install dependencies
npm install

# Place your data file
# Copy student-mat.csv to /public/data/student-mat.csv

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Data Setup

1. Create the data directory: `mkdir -p public/data`
2. Copy your `student-mat.csv` file to `public/data/student-mat.csv`
3. The CSV should use semicolon (`;`) as delimiter (UCI format)

## 📊 Features

### Data Storytelling
- **Scrollytelling sections** with clear narrative flow
- **Research question-based organization** (RQ1, RQ2, RQ3, Synthesis)
- **Key takeaways** and statistical notes for each visualization

### Interactive Visualizations (10 charts)
1. Study Time vs Grade scatter (colored by mother's education)
2. Past Failures boxplot with ANOVA results
3. Grade Trajectories (G1→G2→G3) with individual + mean lines
4. Support Systems density plot
5. Parent Education grouped bar chart
6. PCA scatter plot with variable contributions
7. Alcohol Consumption (weekday/weekend) comparison
8. Going Out frequency analysis
9. Interactive Decision Tree with profile walkthrough

### Technical Features
- **Global filter bar**: Filter by sex, school, location, higher education goals
- **Export functionality**: Download charts as SVG
- **Responsive design**: Works on mobile, tablet, and desktop
- **Smooth animations**: Framer Motion transitions
- **Accessibility**: Proper contrast, focus states, semantic HTML

## 📚 Data Dictionary

| Variable | Description | Values |
|----------|-------------|--------|
| school | Student's school | GP (Gabriel Pereira), MS (Mousinho da Silveira) |
| sex | Student's sex | M (Male), F (Female) |
| age | Student's age | 15-22 |
| Medu | Mother's education | 0-4 (none to higher education) |
| Fedu | Father's education | 0-4 (none to higher education) |
| studytime | Weekly study time | 1-4 (<2h to >10h) |
| failures | Past class failures | 0-3+ |
| schoolsup | School educational support | yes/no |
| famsup | Family educational support | yes/no |
| goout | Going out with friends | 1-5 scale |
| Dalc | Weekday alcohol consumption | 1-5 scale |
| Walc | Weekend alcohol consumption | 1-5 scale |
| G1, G2, G3 | Period grades | 0-20 |

See `src/lib/dataDictionary.ts` for complete variable definitions.

## 📄 Citation

```
P. Cortez and A. Silva. Using Data Mining to Predict Secondary School Student Performance. 
In A. Brito and J. Teixeira Eds., Proceedings of 5th FUture BUsiness TEChnology Conference 
(FUBUTEC 2008) pp. 5-12, Porto, Portugal, April, 2008, EUROSIS, ISBN 978-9077381-39-7.
```

Dataset: [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/320/student+performance)

## 📝 License

MIT License - feel free to use this for your own portfolio!

---


# Numerical Integration Calculator (NIC)

A powerful, web-based numerical integration calculator that approximates definite integrals using multiple numerical methods. Perfect for students, engineers, and researchers who need accurate numerical integration results with visualizations and error analysis.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### 🧮 Integration Methods
- **Trapezoidal Rule** - Simple and efficient for linear approximations
- **Simpson's 1/3 Rule** - High accuracy using quadratic polynomials
- **Simpson's 3/8 Rule** - Alternative method using cubic polynomials

### 📊 Visualization & Analysis
- **Interactive Graphs** - Visual representation of integration methods
- **Error Estimation** - Compare numerical results with high-precision reference values
- **Convergence Analysis** - Analyze how accuracy improves with more intervals
- **Error Comparison Chart** - Visual comparison of absolute errors across methods

### 🎯 Real-World Applications
- Pre-loaded examples for:
  - Area and volume calculations
  - Physics problems (work, energy, motion)
  - Engineering applications (charge, fluid flow)
  - Statistics and probability
  - Economics and finance

### 📚 Comprehensive Documentation
- Detailed tutorials and theory explanations
- Practical examples with step-by-step instructions
- Tips for effective use
- Understanding numerical integration error

## Getting Started

### Installation

No installation required! Simply download the files and open `index.html` in your web browser.

```bash
# Clone or download the repository
git clone <repository-url>
cd NIC-Numerical-Integration-Calculator

# Open index.html in your browser
# Or use a local server:
python -m http.server 8000
# Then visit http://localhost:8000
```

### Quick Start

1. **Enter your function** in the function input field (e.g., `x**2`, `sin(x)`, `exp(x)`)
2. **Set integration bounds** - specify lower bound (a) and upper bound (b)
3. **Select methods** - choose one or more integration methods to compare
4. **Set intervals** - adjust the number of subdivisions (more = more accurate)
5. **Click Calculate** - view results, visualizations, and error analysis

## Supported Functions

### Mathematical Operations
- `+` Addition
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `^` or `**` Exponentiation

### Mathematical Functions
- `sin(x)` - Sine
- `cos(x)` - Cosine
- `tan(x)` - Tangent
- `sqrt(x)` - Square root
- `exp(x)` - Exponential (e^x)
- `log(x)` or `ln(x)` - Natural logarithm
- `abs(x)` - Absolute value

### Constants
- `π` - Pi (3.14159...)
- `e` - Euler's number (2.71828...)

## Examples

### Basic Example
Calculate ∫₀¹ x² dx:
- Function: `x**2`
- Lower bound: `0`
- Upper bound: `1`
- Expected result: `0.333333...`

### Physics Example
Calculate work done by force F(x) = x²:
- Function: `x**2`
- Lower bound: `0`
- Upper bound: `5`
- Result: Work in Joules

### Engineering Example
Calculate fluid flow rate:
- Function: `1 - x**2`
- Lower bound: `0`
- Upper bound: `1`
- Result: Flow rate approximation

## Integration Methods Explained

### Trapezoidal Rule
- **Formula**: ∫[a to b] f(x)dx ≈ (h/2)[f(a) + 2∑f(xᵢ) + f(b)]
- **Error**: O(h²)
- **Best for**: Quick approximations, simple functions

### Simpson's 1/3 Rule
- **Formula**: ∫[a to b] f(x)dx ≈ (h/3)[f(a) + 4∑f(x₂ᵢ₋₁) + 2∑f(x₂ᵢ) + f(b)]
- **Error**: O(h⁴)
- **Best for**: Smooth functions, high accuracy needed
- **Requires**: Even number of intervals

### Simpson's 3/8 Rule
- **Formula**: ∫[a to b] f(x)dx ≈ (3h/8)[f(a) + 3∑f(x₃ᵢ₋₂) + 3∑f(x₃ᵢ₋₁) + 2∑f(x₃ᵢ) + f(b)]
- **Error**: O(h⁴)
- **Best for**: When intervals are divisible by 3
- **Requires**: Number of intervals divisible by 3

## Features in Detail

### Error Estimation
- **Absolute Error**: |numerical_value - reference_value|
- **Relative Error**: |(numerical_value - reference_value) / reference_value| × 100%
- **Reference Value**: Calculated using high-precision Simpson's 1/3 Rule (10,000 intervals)

### Visualization
- Interactive canvas-based graphs
- Color-coded methods for easy comparison
- Shows function curve and approximation areas
- Switch between methods using tabs

### Export Functionality
- Export results as JSON
- Includes all method results, errors, and metadata
- Useful for further analysis or documentation

## Technologies Used

- **HTML5** - Structure
- **CSS3** - Styling (with Tailwind CSS)
- **JavaScript (ES6+)** - Core functionality
- **Canvas API** - Visualizations

## Project Structure

```
NIC-Numerical-Integration-Calculator/
│
├── index.html          # Main HTML file
├── script.js           # Core JavaScript logic
├── style.css           # Custom styles
├── logo.png            # Application logo
└── README.md           # This file
```

## Usage Tips

1. **Start with fewer intervals** (10-20) for quick results
2. **Increase intervals gradually** to improve accuracy
3. **Use Convergence Analysis** to find optimal interval count
4. **Compare multiple methods** to verify consistency
5. **Check error estimates** to assess result quality
6. **Use Real-World Examples** dropdown for quick testing

## Common Pitfalls

- ❌ Avoid functions with discontinuities in the integration interval
- ❌ Ensure Simpson's 1/3 Rule uses an even number of intervals
- ❌ Ensure Simpson's 3/8 Rule uses intervals divisible by 3
- ✅ Check that your function is valid for all x in [a, b]
- ✅ Use more intervals for oscillating functions (sin, cos)

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built for educational and professional use
- Inspired by numerical analysis principles
- Designed with user experience in mind

## Support

For issues, questions, or suggestions, please open an issue on the repository.

---

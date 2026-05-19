# Free Market Paper Lab

A zero-cost, educational market-analysis automation module for FinPulse.

This module is designed for **paper mode only**. It does not place real broker orders, does not require a paid API key, and does not guarantee profit. It is meant to help you demonstrate finance + automation + analytics skills on GitHub.

## What it does

- Pulls free public market data using `yfinance`.
- Runs technical analysis using SMA, RSI, MACD, volatility, and ATR-style risk bands.
- Produces BUY / HOLD / SELL-style educational signals.
- Runs a paper portfolio simulation with virtual cash.
- Shows an interactive Streamlit dashboard.
- Keeps trade logs locally in CSV format.

## Important limitation

Free public stock data is usually delayed, rate-limited, or not exchange-grade. This project is intentionally built for education, testing, and portfolio demonstration. For real-money automation, you would need a regulated broker API, market data permissions, and proper risk controls.

## Run locally

```bash
cd free-market-paper-lab
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
streamlit run app.py
```

On macOS/Linux:

```bash
cd free-market-paper-lab
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
streamlit run app.py
```

## Suggested tickers

Start with liquid, widely tracked instruments:

- `SPY`, `QQQ`, `AAPL`, `MSFT`, `NVDA`
- Canadian examples may work depending on data availability: `RY.TO`, `TD.TO`, `SHOP.TO`, `VFV.TO`, `XEQT.TO`
- Crypto pairs may work depending on source support, such as `BTC-USD`, `ETH-USD`

## Safety rules built in

- Paper mode only.
- No leverage.
- No options.
- No short selling.
- Fixed max allocation per signal.
- Local log of every paper decision.

## Project positioning for your resume

**Free Market Paper Lab** — Built a zero-cost paper-trading and market-analysis dashboard using Python, Streamlit, Pandas, Plotly, and free public market data. The system calculates momentum, trend, volatility, and risk indicators, produces explainable paper signals, and maintains local audit logs for simulated decisions.

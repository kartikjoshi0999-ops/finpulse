# FinPulse Market Analysis Simulator

This folder adds a free-first market analysis simulator to FinPulse.

The project is designed for learning, portfolio building, and strategy testing. It does not connect to any brokerage account and it does not submit orders. All activity is simulated locally.

## Features

- Free no-key data mode using yfinance.
- SMA, RSI, ATR, and volatility-based signals.
- Local simulated portfolio ledger.
- Risk limits for position sizing and daily drawdown.
- CSV logs for signals, simulated orders, and portfolio value.
- Streamlit dashboard for monitoring results.

## Install

From the repo root:

```bash
cd automation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Mac/Linux:

```bash
cd automation
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

## Run

```bash
python -m src.run_bot
```

## Dashboard

```bash
streamlit run src/dashboard.py
```

## Config

Edit `.env`:

```env
SYMBOLS=AAPL,MSFT,NVDA,SPY,QQQ
BAR_INTERVAL=1m
LOOKBACK_PERIOD=5d
STARTING_CASH=10000
RISK_PER_SIGNAL=0.01
MAX_POSITION_PCT=0.20
DAILY_DRAWDOWN_LIMIT=0.02
POLL_SECONDS=60
```

## Strategy

The starter model combines:

- Fast and slow moving averages for trend.
- RSI for overbought/oversold filtering.
- ATR for volatility-aware sizing.
- Simple simulated portfolio controls.

The output is one of:

- BUY
- SELL
- HOLD

## Important

This is not financial advice. It is an educational simulator and GitHub portfolio project. Validate everything with proper testing before considering any external platform connection.

# FinPulse Money Decision Engine

A free-first, manual-confirmation market analysis engine for FinPulse.

This project scans a watchlist, calculates technical indicators, scores potential setups, estimates position size, logs every decision, and shows a dashboard. It does not connect to a brokerage account and it does not submit orders.

## What it does

- Pulls free market data with yfinance.
- Calculates SMA, RSI, ATR, trend strength, volatility, and volume confirmation.
- Scores each symbol from 0 to 100.
- Produces one of four decision labels: Strong Watch, Watch, Avoid, or No Setup.
- Calculates manual position-sizing guidance based on risk settings.
- Saves CSV logs for your trading journal.
- Opens a Streamlit dashboard for monitoring signals.

## What it does not do

- It does not place trades.
- It does not connect to a brokerage account.
- It does not provide guaranteed returns.
- It does not replace a licensed financial advisor.

## Install on Windows

From your repo root:

```powershell
cd automation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
python -m src.run_decision_engine
```

Run the dashboard:

```powershell
streamlit run src/dashboard.py
```

## Config

Edit `.env`:

```env
SYMBOLS=AAPL,MSFT,NVDA,SPY,QQQ
BAR_INTERVAL=1h
LOOKBACK_PERIOD=6mo
ACCOUNT_SIZE=1000
RISK_PER_IDEA=0.01
MAX_POSITION_PCT=0.25
MIN_SCORE_TO_WATCH=65
LOG_DIR=logs
```

## Output example

```text
NVDA | Watch | Score: 71 | Risk/unit: 6.12 | Size guide: 1 share | Notes: Trend positive, RSI acceptable, volume confirmed.
```

## Professional workflow

1. Run the engine.
2. Review signal quality and risk sizing.
3. Check news, earnings, market conditions, and your own thesis.
4. Decide manually in your brokerage app.
5. Record the decision and result in your journal.

## Safety rule

The project intentionally keeps execution manual. Automation supports analysis, not direct control over real money.

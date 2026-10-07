import httpx

async def get_exchange_rate(base: str = "USD", target: str = "USD") -> float:
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(f"https://open.er-api.com/v6/latest/{base}")
            if resp.status_code == 200:
                data = resp.json()
                return data.get("rates", {}).get(target, 1.0)
    except Exception:
        pass
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://restcountries.com/v3.1/all")
    except Exception:
        pass
    return 1.0

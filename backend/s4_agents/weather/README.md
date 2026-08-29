# 4.2 Weather Agent

Forecast, wind and sea-state conditions.

- `weather_agent.py` — wind speed/direction and forecast, read from the
  cached Copernicus NetCDF in `data_sources/marine_data/` with a live
  API fallback.
- `wind_grid_agent.py` — wind flow-field grid powering the animated map
  layer.

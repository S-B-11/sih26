# Data Sources

**Flowchart "Data Sources (Integrated & Interoperable)" band.**

Cached datasets and source adapters shared by the layer-4 agents.

- `marine_data/` — Copernicus Marine (CMEMS) hourly wind NetCDF for the
  Mumbai coastal box.

Datasets are cached deliberately: a live API call is a single point of
failure during a demo.

## Live sources currently called at request time

Open-Meteo (marine + forecast) and NOAA CoastWatch ERDDAP (chlorophyll,
best-effort) are called directly from the agent modules rather than
through an adapter here.

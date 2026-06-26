library(dplyr)
library(lubridate)
library(readr)

data_dir <- file.path("godfrey", "Data")
dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)

uci_zip_url <- "https://archive.ics.uci.edu/static/public/560/seoul+bike+sharing+demand.zip"

zip_file <- tempfile(fileext = ".zip")
extract_dir <- tempfile()

download.file(uci_zip_url, destfile = zip_file, mode = "wb")
dir.create(extract_dir, recursive = TRUE, showWarnings = FALSE)
unzip(zip_file, exdir = extract_dir)

csv_path <- list.files(extract_dir, pattern = "\\.csv$", full.names = TRUE)[1]

seoul_hourly <- read_csv(
  csv_path,
  locale = locale(encoding = "ISO-8859-1"),
  show_col_types = FALSE
) |>
  transmute(
    date = dmy(Date),
    datetime = date + hours(`Hour`),
    day_index = as.integer(date - min(date)) + 1L,
    hour = factor(`Hour`),
    rented_bike_count = `Rented Bike Count`,
    temperature = `Temperature(°C)`,
    humidity = `Humidity(%)`,
    wind_speed = `Wind speed (m/s)`,
    visibility = `Visibility (10m)`,
    dew_point_temperature = `Dew point temperature(°C)`,
    solar_radiation = `Solar Radiation (MJ/m2)`,
    rainfall = `Rainfall(mm)`,
    snowfall = `Snowfall (cm)`,
    season = factor(Seasons),
    holiday = factor(Holiday),
    functioning_day = factor(`Functioning Day`)
  )

seoul_daily <- seoul_hourly |>
  group_by(date, day_index) |>
  summarise(
    rented_bike_count = sum(rented_bike_count, na.rm = TRUE),
    mean_temperature = mean(temperature, na.rm = TRUE),
    mean_humidity = mean(humidity, na.rm = TRUE),
    mean_wind_speed = mean(wind_speed, na.rm = TRUE),
    mean_visibility = mean(visibility, na.rm = TRUE),
    mean_dew_point_temperature = mean(dew_point_temperature, na.rm = TRUE),
    total_solar_radiation = sum(solar_radiation, na.rm = TRUE),
    total_rainfall = sum(rainfall, na.rm = TRUE),
    total_snowfall = sum(snowfall, na.rm = TRUE),
    season = factor(first(as.character(season))),
    holiday_any = factor(if_else(any(as.character(holiday) == "Holiday"), "yes", "no")),
    functioning_day_all = factor(if_else(all(as.character(functioning_day) == "Yes"), "yes", "no")),
    .groups = "drop"
  )

write_csv(seoul_hourly, file.path(data_dir, "seoul_bike_hourly.csv"))
write_csv(seoul_daily, file.path(data_dir, "seoul_bike_daily.csv"))

summary_table <- tibble::tibble(
  dataset = c("seoul_bike_hourly", "seoul_bike_daily"),
  rows = c(nrow(seoul_hourly), nrow(seoul_daily)),
  columns = c(ncol(seoul_hourly), ncol(seoul_daily)),
  path = file.path(
    data_dir,
    c("seoul_bike_hourly.csv", "seoul_bike_daily.csv")
  )
)

print(summary_table)

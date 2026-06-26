library(tidyverse)

data_dir <- file.path("godfrey", "Data")
dir.create(data_dir, recursive = TRUE, showWarnings = FALSE)

# -------------------------------------------------------------------------
# 1. Wage data
# Source: ISLR package
# -------------------------------------------------------------------------

if (!requireNamespace("ISLR", quietly = TRUE)) {
  install.packages("ISLR")
}

wage <- ISLR::Wage |>
  as_tibble() |>
  select(
    year,
    age,
    education,
    jobclass,
    health,
    health_ins,
    wage
  )

write_csv(wage, file.path(data_dir, "wage.csv"))

# -------------------------------------------------------------------------
# 2. Auto MPG data
# Source: UCI Machine Learning Repository
# -------------------------------------------------------------------------

auto_url <- "https://archive.ics.uci.edu/ml/machine-learning-databases/auto-mpg/auto-mpg.data"

auto_mpg <- read_table(
  file = auto_url,
  col_names = c(
    "mpg",
    "cylinders",
    "displacement",
    "horsepower",
    "weight",
    "acceleration",
    "model_year",
    "origin",
    "car_name"
  ),
  na = "?",
  col_types = cols(
    mpg = col_double(),
    cylinders = col_integer(),
    displacement = col_double(),
    horsepower = col_double(),
    weight = col_double(),
    acceleration = col_double(),
    model_year = col_integer(),
    origin = col_integer(),
    car_name = col_character()
  )
) |>
  drop_na(horsepower) |>
  mutate(
    origin = case_when(
      origin == 1 ~ "USA",
      origin == 2 ~ "Europe",
      origin == 3 ~ "Japan",
      TRUE ~ NA_character_
    ),
    origin = factor(origin)
  )

write_csv(auto_mpg, file.path(data_dir, "auto_mpg.csv"))

# -------------------------------------------------------------------------
# 3. Bike sharing daily data
# Source: UCI Machine Learning Repository
# -------------------------------------------------------------------------

bike_zip <- tempfile(fileext = ".zip")
bike_dir <- tempfile()

download.file(
  url = "https://archive.ics.uci.edu/ml/machine-learning-databases/00275/Bike-Sharing-Dataset.zip",
  destfile = bike_zip,
  mode = "wb"
)

dir.create(bike_dir, recursive = TRUE, showWarnings = FALSE)
unzip(bike_zip, exdir = bike_dir)

bike_daily <- read_csv(
  file.path(bike_dir, "day.csv"),
  show_col_types = FALSE
) |>
  transmute(
    date = as.Date(dteday),
    season = factor(
      season,
      levels = 1:4,
      labels = c("spring", "summer", "autumn", "winter")
    ),
    year = factor(yr, levels = c(0, 1), labels = c("2011", "2012")),
    month = factor(mnth, levels = 1:12, labels = month.abb),
    holiday = factor(holiday, levels = c(0, 1), labels = c("no", "yes")),
    weekday = factor(
      weekday,
      levels = 0:6,
      labels = c("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")
    ),
    workingday = factor(workingday, levels = c(0, 1), labels = c("no", "yes")),
    weather = factor(
      weathersit,
      levels = 1:3,
      labels = c("clear_or_partly_cloudy", "mist_or_cloudy", "light_rain_or_snow")
    ),
    temp = temp,
    feels_like_temp = atemp,
    humidity = hum,
    windspeed = windspeed,
    casual = casual,
    registered = registered,
    count = cnt
  )

write_csv(bike_daily, file.path(data_dir, "bike_daily.csv"))

# -------------------------------------------------------------------------
# Simple verification
# -------------------------------------------------------------------------

datasets <- list(
  wage = wage,
  auto_mpg = auto_mpg,
  bike_daily = bike_daily
)

summary_table <- tibble(
  dataset = names(datasets),
  rows = map_int(datasets, nrow),
  columns = map_int(datasets, ncol),
  file = file.path(data_dir, paste0(names(datasets), ".csv"))
)

print(summary_table)

# Shared setup for 161.251 Regression Modelling lecture .Rmd files.
# Sourced by every canonical lecture in lectures/ and by Bookdown chapter wrappers.
# Do NOT copy this content into individual lecture files.

suppressPackageStartupMessages({
  library(knitr)
  library(tidyverse)
  library(broom)
  library(lubridate)
})

options(knitr.kable.NA = "")

knitr::opts_chunk$set(
  dev = c("png", "pdf"),
  comment = "",
  fig.align = "center",
  fig.height = 6,
  fig.width = 7,
  fig.alt = "unlabelled",
  tidy = TRUE,
  cache = TRUE,
  warning = FALSE,
  message = FALSE
)
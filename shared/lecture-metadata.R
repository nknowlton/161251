# Display labels may differ from the numeric lecture identifiers used in paths.
lecture_label <- function(row) {
  if ('LectureLabel' %in% names(row) && !is.na(row$LectureLabel[1]) &&
      nzchar(trimws(row$LectureLabel[1]))) return(trimws(row$LectureLabel[1]))
  as.character(row$LectureNo[1])
}

lecture_heading <- function(row) {
  label <- lecture_label(row)
  prefix <- if (grepl('/', label, fixed = TRUE)) 'Lectures' else 'Lecture'
  sprintf('%s %s: %s', prefix, label, row$LectureTitle[1])
}

lecture_document_title <- function(row) {
  if (lecture_label(row) != as.character(row$LectureNo[1])) lecture_heading(row)
  else row$LectureTitle[1]
}

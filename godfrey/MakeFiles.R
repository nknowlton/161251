library(dplyr)

# get file details for each lecture (in order)
read.csv("TopicList.csv", header=TRUE) %>% arrange(LectureNo) -> LectureList 

Updates=0

for(i in 1:nrow(LectureList)){

  LectureNo <- LectureList$LectureNo[i]
  Week <- LectureList$Week[i]
  IsAppendix <- Week == 0

TargetFile = paste0("Lecture",i,".Rmd")
InClassFile = paste0("InClass/", TargetFile)
print(InClassFile)
AsBookChapter = paste0("AsBook/", ifelse(i<10, "0", ""), i, LectureList$Label[i], ".Rmd")
print(AsBookChapter)
ContentFile = paste0("Content/", LectureList$Label[i], ".Rmd")
print(ContentFile)

if(file.mtime(InClassFile) < file.mtime(ContentFile)| !file.exists(InClassFile )) {

Updates=Updates+1

# make files for class delivery
# Appendices (Week 0) have no date line
if(IsAppendix){
  cat(paste0('---
title: "Lecture ', LectureNo, ': ', LectureList$LectureTitle[i], '"
subtitle: 161.251 Regression Modelling
author: "Presented by ', LectureList$Presenter[i], '"
output:
  html_document:
    code_download: true
    theme: yeti
    highlight_style: pygments
  html_notebook:
    code_download: true
    theme: yeti
    highlight_style: pygments
  ioslides_presentation:
    widescreen: true
    smaller: true
  word_document: default
  slidy_presentation: 
    theme: yeti
    highlight_style: pygments
  pdf_document: default
---




'), file =InClassFile)
} else {
  cat(paste0('---
title: "Lecture ', LectureNo, ': ', LectureList$LectureTitle[i], '"
subtitle: 161.251 Regression Modelling
author: "Presented by ', LectureList$Presenter[i], '"  
date: "Week ', Week, ' of Semester 2, `r lubridate::year(lubridate::now())`"
output:
  html_document:
    code_download: true
    theme: yeti
    highlight_style: pygments
  html_notebook:
    code_download: true
    theme: yeti
    highlight_style: pygments
  ioslides_presentation:
    widescreen: true
    smaller: true
  word_document: default
  slidy_presentation: 
    theme: yeti
    highlight_style: pygments
  pdf_document: default
---




'), file =InClassFile)
}


file.append(InClassFile, "Content/Setup.Rmd")

file.append(InClassFile, ContentFile)

# make chapter files for bookdown
cat(paste0('# ', LectureList$LectureTitle[i], '{#', LectureList$Label[i], '}\n\n[In class version](https://R-Resources.massey.ac.nz/161251/Lectures/Lecture', i, '.html)\n\n'), file=  AsBookChapter)
file.append(AsBookChapter, "Content/Setup.Rmd")
file.append(AsBookChapter, ContentFile)


} # end of lecture files condition
}# end of for loop over lectures
if(Updates>0){
# make index file

cat('---
title: "Index of Lecture Material"
subtitle: 161.251 Regression Modelling
author: "Presented by Jonathan Godfrey and Nick Knowlton"
date: "Semester 2, `r lubridate::year(lubridate::now())`"
output:
  html_document:
    theme: yeti
    highlight_style: pygments
---
', file = "InClass/Index.Rmd")

file.append("InClass/Index.Rmd", "Content/Setup.Rmd")

for(i in 1:12){
WeekSet = LectureList[LectureList$Week == i, ]



# Add presenter attribution to week heading
Presenters <- unique(sapply(strsplit(as.character(WeekSet$Presenter), " <"), "[", 1))
WeekLabel <- if(length(Presenters) == 1) {
  paste0("Week ", i, " \U2014 ", Presenters)
} else {
  paste0("Week ", i, " \U2014 ", paste(Presenters, collapse = " & "))
}

if(nrow(WeekSet)>0){ 
cat(paste('\n\n## ', WeekLabel, '\n'), file = "InClass/Index.Rmd", append =TRUE)

# Index links use sequential file numbers within that week
cat(paste0('\n[Lecture ', WeekSet$LectureNo, ': ', WeekSet$LectureTitle, '](Lecture', 1:nrow(WeekSet), '.html)'), file = "InClass/Index.Rmd", append =TRUE)

}
}
}

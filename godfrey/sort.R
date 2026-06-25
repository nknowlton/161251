library(tidyverse)

In = read.csv("TopicList.csv")

In %>% arrange(LectureNo) %>% mutate(Week = round((LectureNo+1)/3,0)) %>% write.csv(file="TopicList.csv", row.names=FALSE)





Find = ""
Replace = ""

setwd("./Content/")
for(i in list.files(pattern=".Rmd")){

Lines= readLines(i)
if(any(grepl(Find, Lines, fixed=TRUE))){
cat(i, "has replacements to make")
file.copy(i, paste0(i, ".bak"))
Lines = gsub(Find, Replace, Lines, fixed=TRUE)
writeLines(Lines, con=i)
}
}

setwd("..")

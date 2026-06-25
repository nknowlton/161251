
for(i in list.files(pattern=".Rmd")){
Outfile = sub(".Rmd", ".html", i)
if(file.mtime(i) > file.mtime(Outfile)| !file.exists(Outfile)) {
rmarkdown::render(i, output_file=Outfile, encoding="utf-8")
}
}

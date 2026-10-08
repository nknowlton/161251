-- Keep the book's displayed section numbers aligned with lecture filenames.
-- Lecture numbers may have gaps when two lectures are combined.
local lecture_numbers = {}
for line in io.lines('_bookdown.yml') do
  local number, slug = line:match('^%s*%-%s*"(%d+)%-([^"/]+)%.Rmd"')
  if number then lecture_numbers[slug] = tonumber(number) end
end

local counters = {}
function Header(header)
  if header.level == 1 then
    counters = {lecture_numbers[header.identifier]}
  end
  if not counters[1] or header.classes:includes('unnumbered') then
    return header
  end
  if header.level > 1 then
    counters[header.level] = (counters[header.level] or 0) + 1
  end
  for level = header.level + 1, 6 do counters[level] = 0 end
  local number = {}
  for level = 1, header.level do
    number[level] = tostring(counters[level] or 0)
  end
  if header.level == 1 and header.attributes['data-lecture-label'] then
    number[1] = 'Lectures ' .. header.attributes['data-lecture-label'] .. ':'
  end
  header.content:insert(1, pandoc.Space())
  header.content:insert(1, pandoc.Span(
    pandoc.Str(table.concat(number, '.')),
    pandoc.Attr('', {'header-section-number'})
  ))
  return header
end

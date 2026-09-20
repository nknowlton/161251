-- Escape caret characters in figure captions for LaTeX output.
-- Master lecture files use plain-text captions such as "R^2". Pandoc's
-- Beamer writer treats the caret as TeX syntax unless it is escaped.

local function escape_carets(inlines)
  if inlines == nil then return inlines end

  local result = {}
  for _, inline in ipairs(inlines) do
    if inline.t == "Str" and inline.text:find("%^") then
      local remaining = inline.text
      while true do
        local position = remaining:find("%^")
        if position == nil then
          if remaining ~= "" then table.insert(result, pandoc.Str(remaining)) end
          break
        end
        if position > 1 then
          table.insert(result, pandoc.Str(remaining:sub(1, position - 1)))
        end
        table.insert(result, pandoc.RawInline("tex", "\\^{}"))
        remaining = remaining:sub(position + 1)
      end
    else
      table.insert(result, inline)
    end
  end
  return result
end

function Figure(figure)
  if figure.caption then
    if figure.caption.long then
      figure.caption.long = escape_carets(figure.caption.long)
    else
      figure.caption = escape_carets(figure.caption)
    end
  end
  return figure
end

function Caption(caption)
  if caption.long then
    caption.long = escape_carets(caption.long)
  else
    caption = escape_carets(caption)
  end
  return caption
end

function RawBlock(block)
  if block.format == "tex" then
    block.text = block.text:gsub("R%^2", "R\\^{}2")
  end
  return block
end

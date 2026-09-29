function Para(el)
  local text = pandoc.utils.stringify(el)

  -- Pandoc may convert "..." to the single ellipsis character.
  if text:match("^%s*%.%s*%.%s*%.%s*$") or text:match("^%s*…%s*$") then
    return {}
  end
end

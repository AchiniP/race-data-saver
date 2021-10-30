/**
 * resolve file extension (whether js(in build) or ts(when using ts-node)
 * @param filename
 */
const fileResolver =  (filename: string):string => {
  if (!process[Symbol.for("ts-node.register.instance")]) {
    return filename.replace('.ts','.js');
  }
  return filename;
}

export default  {
  fileResolver
}

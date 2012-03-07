require 'json/pure'

class Build < Thor  
  # This is the list of files to concatenate. The first file will appear at the top of the final file. All files are relative to the lib directory.
  FILES = [
    "license.js", "src/GlobalObject.js", "src/Node.js", "src/Container.js", "src/Stage.js",
    "src/Layer.js", "src/Group.js", "src/geometries/Shape.js", "src/geometries/Rect.js", "src/geometries/Circle.js", "src/geometries/Image.js",
    "src/geometries/Polygon.js", "src/geometries/RegularPolygon.js", "src/geometries/Star.js", "src/geometries/Text.js"
  ]
  
  desc "dev", "Concatenate all the js files into /dist/kinetic-vVERSION.js."
  method_option :date, aliases: "-d", required: false, type: :string, desc: "The release date"
  def dev(version)
    file_name = "dist/kinetic-v#{version}.js"
    
    puts ":: Deleting other development files..."
    Dir.foreach("dist") do |file|
      if file.match(/kinetic-v.+\.(\d|\.)+\.js/)
        File.delete("dist/" + file)
      end
    end
    
    puts ":: Building the file /#{file_name}..."
    File.open(file_name, "w") do |file|
      file.puts concatenate(version, options[:date])
    end
    
    puts "   -> Done!"
  end
  
  desc "prod", "Concatenate all the js files in into /dist/kinetic-vVERSION.min.js and minify it."
  method_option :date, aliases: "-d", required: false, type: :string, desc: "The release date"
  def prod(version)
    file_name = "dist/kinetic-v#{version}.min.js"
    
    puts ":: Deleting other development files..."
    Dir.foreach("dist") do |file|
      if file.match(/kinetic-v.+\.min\.js/)
        File.delete("dist/" + file)
      end
    end
    
    puts ":: Building the file /#{file_name}..."
    require 'json/pure'
    require 'uglifier'
    File.open(file_name, "w") do |file|
      uglify = Uglifier.compile(concatenate(version, options[:date]))
      uglify.sub!(/\*\/ .+ \*\//xm, "*/")
      file.puts uglify
    end
    puts ":: Minifying the file /#{file_name}..."
    puts "   -> Done!"
  end
  
  private
  
    def concatenate(version, date)
      date ||= Time.now.strftime("%b %d %Y")
      content = ""
      FILES.each do |file|
        content << IO.read(File.expand_path(file)) << "\n"
      end
      
      # Add the version number
      content.sub!("@version", version)
      
      # Add the date
      content.sub!("@date", date)
      
      return content
    end

end
  

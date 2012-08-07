
<!DOCTYPE>
<html>
    <head>
        <title>KineticJS - HTML5 Canvas JavaScript Library Framework</title>
        <link rel="stylesheet" href="http://www.kineticjs.com/style.css" type="text/css"/>
        <script type="text/javascript"> 
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-10955171-8']);
            _gaq.push(['_trackPageview']);
            
            (function(){
                var ga = document.createElement('script');
                ga.type = 'text/javascript';
                ga.async = true;
                ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(ga, s);
            })();
        </script>
    </head>
    <body>
        <div id="wrapper">
            <header>
                <a id="logo" href="http://www.kineticjs.com">
                </a>

            </header>
            <section >
                <?php if(isset($_POST)){
                    echo'<pre>'.print_r($_POST,true).'</pre>';
                    
                }?>
                <h1>KineticJS Builder</h1>
                <h2>Basic configuration</h2>
                <form action="build.php" method="post" >
                    Version:<input type="text" name="version" value="core"/><br/>
                    Minfied:<input type="checkbox" name="minified" />

                    <?php

                    function read_all_files($root = 'src') {
                        $files = array();
                        $directories = array();
                        $last_letter = $root[strlen($root) - 1];
                        $root = ($last_letter == '\\' || $last_letter == '/') ? $root : $root . DIRECTORY_SEPARATOR;

                        $directories[] = $root;

                        while (sizeof($directories)) {
                            $dir = array_pop($directories);
                            if ($handle = opendir($dir)) {
                                while (false !== ($file = readdir($handle))) {
                                    if ($file == '.' || $file == '..') {
                                        continue;
                                    }

                                    $file = $dir . $file;
                                    if (is_dir($file)) {
                                        $directory_path = $file . DIRECTORY_SEPARATOR;
                                        array_push($directories, $directory_path);
                                    } elseif (is_file($file)) {
                                        $info = pathinfo($file);
                                        if (strtolower($info['extension']) === 'js') {
                                            $files[substr($dir, 0, -1)][] = $file;
                                        }
                                    }
                                }
                                closedir($handle);
                            }
                        }

                        return $files;
                    }

                    $allFiles = read_all_files('src/');
                    ?>
                    <h2>Select Files to build</h2>
                    <?php foreach ($allFiles as $dir => $files): ?>
                        <h3><?= $dir ?></h3>
                        <ul>
                            <?php foreach ($files as $file): ?>

                                <li><input type="checkbox" checked="checked" name="files[]" value="<?= $file ?>" /><?= basename($file) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    <?php endforeach; ?>
                    <button id="download" style="border-width: 0px;cursor:pointer;" type="submit"><span>Build</span></button>
                </form>

            </section>


            <footer>
                <div id="footerWrapper">
                    <a href="http://www.kineticjs.com"><img src="http://www.kineticjs.com/img/kineticjs-bolt-print-100x98.png"></a>
                </div>
            </footer>
        </div>
    </body>
</html>
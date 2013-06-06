import argparse
import os.path
import shutil

import distutils.archive_util

import copy_files
import generate_config
import concatenate_files
import optimize

'''
    to doo:
        
        - optimize the css too
'''

default_htmlFile = "../home.html"
default_concatenateConfig = "config.txt"
default_copyFilesConfig = "copy_files_config.txt"
default_resultingFolder = "paint"

def go( htmlFile= default_htmlFile,
        concatenateConfig= default_concatenateConfig,
        copyFilesConfig= default_copyFilesConfig,
        resultingFolder= default_resultingFolder ):

        # to guarantee that the paths are relative to the current file's path (and not the working directory)
    htmlFile = os.path.join( os.path.dirname(__file__), htmlFile )
    concatenateConfig = os.path.join( os.path.dirname(__file__), concatenateConfig )
    copyFilesConfig = os.path.join( os.path.dirname(__file__), copyFilesConfig )
    resultingFolder = os.path.join( os.path.dirname(__file__), resultingFolder )


        # it may have a previous copy of the files (from a previous run of this script), so if there are files that have different names
        # (for example, updating a library), the release will end up with both files, so we remove the folder first
    removeFolder( resultingFolder )
        
        # and remove also the compressed folder
    removeFolder( resultingFolder + '.zip' )
    
    
    copy_files.copyFiles( copyFilesConfig )
    
    generate_config.generate( htmlFile, concatenateConfig )
    
    concatenatedFileName = "minimized.js"
    concatenatedFilePath = os.path.join( resultingFolder, concatenatedFileName )
     
    
    concatenate_files.concatenate( concatenateConfig, concatenatedFilePath )
    
    removeStrict( concatenatedFilePath )
    
    
        # run it through closure compiler to optimize (the javascript file)
    optimize.js( concatenatedFilePath )
    
    
        # optimize the css too -- #HERE parece k o closure compiler n funciona com css
    for cssFile in getCssFiles( resultingFolder ):
        optimize.css( cssFile )
    
    
    createNewIndex( htmlFile, concatenatedFileName, os.path.join( resultingFolder, os.path.basename( htmlFile ) ) )

        # zip the folder
    compressFolder( resultingFolder )
    
    



'''
    Returns a list with the path to the css files
'''

def getCssFiles( resultingFolder ):
    
    folder = os.path.join( resultingFolder, 'css' )
    
    fileNames = os.listdir( folder )
    
    paths = []
    
    for file in fileNames:
        
        filePath = os.path.normpath( os.path.join( folder, file ) )
        
        if not os.path.isdir( filePath ):
            paths.append( filePath )
    
    return paths



'''
    Removes the folder in the path recursively
'''
    
def removeFolder( path ):
    
    if os.path.isdir( path ):
        shutil.rmtree( path )
    
    
    
    
    
'''
    Creates a compressed folder with the todolist release
'''
    
def compressFolder( resultingFolder ):

    previousPath = os.getcwd()

    distutils.archive_util.make_archive(resultingFolder, 'zip', os.path.join(previousPath, resultingFolder))
    
    
    
    
'''
    Removes the 'use strict'; (but the first one) -- closure complains about it
'''

def removeStrict( jsFile ):
    
    file = open( jsFile, 'r' )
    
    content = file.read()
    
    file.close()
    
        # remove all the 'use strict;'
    newContent = content.replace( "'use strict';", "" )
    
        # add just one in the beginning
    newContent = "'use strict';" + newContent
    
    file = open( jsFile, 'w' )
    
    file.write( newContent )
    
    file.close()
    
    
'''
    Removes the part between the flags, and adds a single script with the concatenated file
    
    Arguments:
        
        indexPath        (string) : name of the index.html file
        concatenatedFile (string) : path to the concatenated file just created
        newIndexName     (string) : name of the new file that is created
'''

def createNewIndex( indexPath, concatenatedFile, newIndexName ):
    
        # get the file's content
    index = open( indexPath, 'r' )
    
    text = index.read()
    
    index.close()
    
    startFlag = "<!-- CONCATENATE_START -->"
    endFlag   = "<!-- CONCATENATE_END -->"
    
        # find the position where the flags are

    start = text.find( startFlag )
    end = text.find( endFlag, start )


        # get the part before the start flag
    textBefore = text[ : start ]
    
        # and after the end flag
    textAfter = text[ end + len(endFlag) : ]
    
    
        # create the new file
    newIndexName = os.path.normpath( newIndexName )

    newIndex = open( newIndexName, 'w' )
    
    newIndex.write( textBefore + '<script type="text/javascript" src="' + concatenatedFile + '"></script>' + textAfter )
    
    newIndex.close()
    
    print( "Created file:", newIndexName )
    
    

if __name__ == '__main__':    

    parser = argparse.ArgumentParser( description= 'Release the paint -- makes a copy of the program with the necessary files only, and minimizes the javascript' )

    parser.add_argument( 'htmlFile', help= "path to the html file.", nargs= "?", default= default_htmlFile )
    parser.add_argument( 'concatenateConfig', help= "path to the configuration file used to concatenate the javascript files.", nargs= "?", default= default_concatenateConfig )
    parser.add_argument( 'copyFilesConfig', help= "path to the configuration file that tells which files to copy.", nargs= "?", default= default_copyFilesConfig )
    parser.add_argument( 'resultingFolder', help= "name of the folder that is created in the current path and contains the copies.", nargs= "?", default= default_resultingFolder )
    
    args = parser.parse_args()

    go( args.htmlFile, args.concatenateConfig, args.copyFilesConfig, args.resultingFolder )

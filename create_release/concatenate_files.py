"""

For a more detailed description, visit https://bitbucket.org/drk4/concatenate_files/overview

"""


'''

    Copyright - 2012 - Pedro Ferreira

    This file is part of concatenate_files.

    concatenate_files is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    concatenate_files is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with concatenate_files.  If not, see <http://www.gnu.org/licenses/>.

'''

import os
import argparse
import json
import textwrap


# exceptions used in the program

class CouldntConvertFromJsonError( ValueError ):
    pass

class NotADictError( ValueError ):
    pass




def concatenateFiles( directoryPath, fileNames ):

    '''

    Opens the files, and appends its content
    Returns a string with the result

    Arguments:

        directoryPath (string) : absolute path to the directory
        fileNames       (list) : has the file names

    '''

    text = ""

    for files in fileNames:

        path = os.path.join( directoryPath, files )

        if os.path.isdir( path ):
            continue

        try:
            currentFile = open( path, "r" )

        except IOError:

            print( "Didn't find:", path )

        else:
            content = currentFile.read()

            currentFile.close()

            text += content

    return text


#HERE poder chamar a funcao tambem com uma variavel (no formato json), a substituir o ficheiro de config 

def concatenate( pathToConfig, resultingFileName, basePath="" ):

    '''

    For a more detailed description, visit https://bitbucket.org/drk4/concatenate_files/overview

    Arguments:

        pathToConfig      (string) : path to the configuration file
        resultingFileName (string) : name of the file which will have the result (can be a relative path too)
        basePath          (string) : the paths in the configuration file are relative to this

    If basePath is not provided, the paths are relative to the current path where the script is executed.

    '''

        # see if valid path was given
        # by default, the base path is where the script is executed, but can be changed
        # changes in the base path only applies to the files in the configuration file
    if basePath:

        if not os.path.exists( basePath ):

            raise ValueError( "Invalid base path:", basePath )

    else:

        basePath = os.path.dirname( os.path.abspath(__file__) )


        # read the configuration file
    try:
        configFile = open( pathToConfig, "r" )

    except IOError:

        raise IOError( "Couldn't open the configuration file: " + pathToConfig )


        # convert to an object from the json representation
    try:
        configContent = json.loads( configFile.read() )

    except ValueError:
        raise CouldntConvertFromJsonError( "Invalid configuration (couldn't convert from the json representation): " + pathToConfig )


    configFile.close()


        # check if we have a dictionary in the configuration
    if not isinstance( configContent, dict ):

        raise NotADictError( textwrap.dedent("""

            Invalid configuration (has to be an object/dictionary)
            Content: {0}
            Type: {1}

                """.format( configContent, type(configContent) )) )



    concatenatedText = ""

        # travel through all the folders
    for folder in configContent:

            # check if we got a string for the folder (the key)
        if not isinstance( folder, str ):

            print( "Invalid folder (the key has to be a string)" )
            print( "Content:", folder )
            print( "Type:", type( folder ) )
            continue


            # check if we have a list as the value
        if not isinstance( configContent[ folder ], list ):

            print( "Invalid configuration (the value has to be an array/list)" )
            print( "Content:", configContent[ folder ] )
            print( "Type:", type( configContent[ folder ] ) )
            continue


        path = os.path.join( basePath, folder )

            # normalize the path
        path = os.path.abspath( path )

        print( "Dealing with folder:", path )

            # if there's an empty list, it means to open all the files in that folder (its in random order)		
        if len( configContent[ folder ] ) == 0:

            print( "    Concatenating all the files in this folder." )

                # get a list of the file names in the directory
            fileNames = os.listdir( path )

            # the list will specify the files to open
        else:
            fileNames = configContent[ folder ]


        concatenatedText += concatenateFiles( path, fileNames )



    resultingFileName = os.path.normpath( resultingFileName )

        # create the new file
    try:
        newFile = open( resultingFileName, "w" )

    except IOError:
        raise IOError( "Couldn't create the file:", resultingFileName )


    newFile.write( concatenatedText )

    newFile.close()

    print( "\nCreated file:", resultingFileName )
    print( "Have a nice day!\n" )

    return





    # set up the parser, where the first argument is the path to the configuration file
    # and the second the name of the resulting file (default: result.txt)
    # basically: python concatenate_files.py config.txt (if the configuration file is in the same folder)

if __name__ == '__main__':

    parser = argparse.ArgumentParser( description = 'Concatenate files' )

    parser.add_argument( 'configFile', help = "path to the configuration file." )
    parser.add_argument( 'resultingFileName', help = "the name of the file (or a relative path to it) which will have the concatenated text.", nargs="?", default="result.txt" )
    parser.add_argument( 'basePath', help = "The paths in the configuration file are relatives, and are relative to the path where this script is executed. You can change this by proving an absolute path here.", nargs="?", default="" )

    args = parser.parse_args()


    concatenate( args.configFile, args.resultingFileName, args.basePath )


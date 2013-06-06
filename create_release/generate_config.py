"""

For a more detailed description, visit https://bitbucket.org/drk4/concatenate_files/overview

"""
"""

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

"""

import argparse
import re
import json
import os.path


default_path = "../index.html"
default_configName = "config.txt"

def generate( path= default_path, configName= default_configName ):

    """
    Generates the configuration file needed for the concatenate_files script.

    It reads a file, looks up for two flags (CONCATENATE_START -- CONCATENATE_END)
        which limits the the part we want to search.
    Then, based on a regexp, the paths for the files to be concatenated are obtained

    Arguments:

        path       (string) : path to the index.html
        configName (string) : name (or relative path to) of the configuration file to be generated
    """

    path = os.path.join( os.path.dirname(__file__), path )
    configName = os.path.join( os.path.dirname(__file__), configName )

        # get the file's content
    with open( path, 'r', encoding= 'utf-8' ) as f:

        text = f.read()


        # find the position where the flags are

    start = text.find( "CONCATENATE_START" )
    end = text.find( "CONCATENATE_END", start )


        # get the limited text
    selectedPart = text[ start : end ]

        # find all the paths, based on the regexp
    filesList = re.findall(r'src="(.*)"', selectedPart)

        # construct the configuration format
        # the filesList will have a relative path to the files
    directory = os.path.dirname( path )

    config = { directory: filesList }


        # and create the configuration file


    with open( configName, "w", encoding= 'utf-8' ) as f:

        f.write( json.dumps( config, sort_keys = True, indent = 4 ) )





if __name__ == '__main__':

    parser = argparse.ArgumentParser( description = 'Generate the configuration file for concatenate_files' )

    parser.add_argument( 'path', help = "path to the html file (default: index.html).", nargs="?", default= default_path )
    parser.add_argument( 'configName', help = "name of the configuration file (default: config.txt).", nargs="?", default= default_configName )

    args = parser.parse_args()

    generate( args.path, args.configName )

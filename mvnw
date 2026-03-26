#!/bin/sh
# ----------------------------------------------------------------------------
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
# ----------------------------------------------------------------------------

# ----------------------------------------------------------------------------
# Apache Maven Wrapper startup script, version 3.2.0
# ----------------------------------------------------------------------------

set -euf
[ "${MVNW_VERBOSE-}" != true ] || set -x

# OS specific support.
native_path() { printf %s\\n "$1"; }
case "$(uname)" in
  CYGWIN* | MINGW*)
    [ -z "${JAVA_HOME-}" ] || JAVA_HOME="$(cygpath --unix "$JAVA_HOME")"
    native_path() { cygpath --path --windows "$1"; }
    ;;
esac

# set JAVA_CMD
if [ -n "${JAVA_HOME-}" ]; then
  if [ -x "$JAVA_HOME/jre/sh/java" ]; then
    JAVA_CMD="$JAVA_HOME/jre/sh/java"
  else
    JAVA_CMD="$JAVA_HOME/bin/java"
    if [ ! -x "$JAVA_CMD" ]; then
      die "ERROR: JAVA_HOME is set to an invalid directory: $JAVA_HOME"
    fi
  fi
else
  JAVA_CMD="$(command -v java)" || die "ERROR: JAVA_HOME is not set and java not found in PATH"
fi

# hash string like Java, truncated
hash_string() {
  str="${1-}" h=0
  while [ -n "$str" ]; do
    char="${str%"${str#?}"}"
    h=$(((h * 31 + $(LC_CTYPE=C printf %d "'$char")) % 4294967296))
    str="${str#?}"
  done
  printf %x\\n $h
}

verbose() { :; }
[ "${MVNW_VERBOSE-}" != true ] || verbose() { printf %s\\n "${1-}"; }

die() {
  printf %s\\n "$1" >&2
  exit 1
}

trim() {
  # MWRAPPER-139:
  #   Trims trailing carriage returns and whitespace
  printf "%s" "${1}" | tr -d '[:space:]'
}

# parse distributionUrl and optional wrapperUrl from maven-wrapper.properties
while IFS="=" read -r key value; do
  case "${key-}" in
    distributionUrl) distributionUrl=$(trim "${value-}") ;;
    wrapperUrl) wrapperUrl=$(trim "${value-}") ;;
  esac
done <"${0%/*}/.mvn/wrapper/maven-wrapper.properties"
[ -n "${distributionUrl-}" ] || die "ERROR: no distributionUrl in ${0%/*}/.mvn/wrapper/maven-wrapper.properties"

# prepare, verify and use the maven-wrapper.jar
wrapperJarPath="${0%/*}/.mvn/wrapper/maven-wrapper.jar"
if [ -r "$wrapperJarPath" ]; then
  verbose "Found maven-wrapper.jar"
else
  verbose "Downloading maven-wrapper.jar..."
  if command -v wget >/dev/null; then
    verbose "Using wget"
    wget -q -O "$wrapperJarPath" "${wrapperUrl-https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar}" || die "ERROR: Failed to download Maven Wrapper"
  elif command -v curl >/dev/null; then
    verbose "Using curl"
    curl -fsSL -o "$wrapperJarPath" "${wrapperUrl-https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar}" || die "ERROR: Failed to download Maven Wrapper"
  else
    die "ERROR: wget or curl is required to download Maven Wrapper"
  fi
fi

# run using the wrapper
exec "$JAVA_CMD" \
  ${JAVA_OPTS:+"$JAVA_OPTS"} \
  ${MAVEN_OPTS:+"$MAVEN_OPTS"} \
  -cp "$(native_path "$wrapperJarPath")" \
  "-Dmaven.multiModuleProjectDirectory=${0%/*}" \
  org.apache.maven.wrapper.MavenWrapperMain "$@"

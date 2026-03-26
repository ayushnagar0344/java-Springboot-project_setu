@REM Maven Wrapper script for Windows
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set "MVNW_DIR=%~dp0"
set "WRAPPER_JAR=%MVNW_DIR%.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

@REM Find java.exe
if defined JAVA_HOME (
    set "JAVA_CMD=%JAVA_HOME%\bin\java.exe"
) else (
    set "JAVA_CMD=java"
)

@REM Verify java is accessible
"%JAVA_CMD%" -version >NUL 2>&1
if ERRORLEVEL 1 (
    echo ERROR: JAVA_HOME is not set and java is not in PATH. >&2
    exit /B 1
)

@REM Download wrapper jar if missing
if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven Wrapper...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar' -OutFile '%WRAPPER_JAR%'"
    if ERRORLEVEL 1 (
        echo ERROR: Failed to download Maven Wrapper >&2
        exit /B 1
    )
)

@REM Run Maven via wrapper
"%JAVA_CMD%" %MAVEN_OPTS% -Dmaven.multiModuleProjectDirectory="%MVNW_DIR%." -cp "%WRAPPER_JAR%" %WRAPPER_LAUNCHER% %*

exit /B %ERRORLEVEL%

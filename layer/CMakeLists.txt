cmake_minimum_required(VERSION 3.10)
project(Oversvamningskollen)

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find required packages
find_package(CURL REQUIRED)

include_directories(/usr/include)  # MSYS2 default include path
# Alternative: include_directories(C:/msys64/usr/include)  # If the above doesn't work

# Add executable
add_executable(test
    fetcher/Fetcher.cpp
    main.cpp
    get_active_ids.cpp
)

# Link libraries
target_link_libraries(test PRIVATE CURL::libcurl)

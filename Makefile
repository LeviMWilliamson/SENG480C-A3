SOURCE_DIRECTORY := source
TARGET_DIRECTORY := distribution

SOURCES := $(shell find $(SOURCE_DIRECTORY) -type f ! -wholename *.h)
TARGETS := $(patsubst $(SOURCE_DIRECTORY)%,$(TARGET_DIRECTORY)%,$(SOURCES))

PREPROCESSOR := $(shell which cpp)
CPPFLAGS :=  -P -undef -Wundef -nostdinc -traditional-cpp -trigraphs -fdollars-in-identifiers -C -include source/headers/definitions.h

all: $(TARGETS)

$(TARGETS): $(SOURCES)
	@mkdir -p $(@D)
	$(PREPROCESSOR) $(CPPFLAGS) $(patsubst $(TARGET_DIRECTORY)%,$(SOURCE_DIRECTORY)%,$@) > $@

.PHONY: clean
clean:
	rm -rf $(TARGET_DIRECTORY)

.PHONY: run
run: all
	@cd $(TARGET_DIRECTORY) && python3 -m http.server

.PHONY: watch
watch: all
	while true do; do \
		make clean; \
		make all; \
		inotifywait -qre close_write .; \
	done

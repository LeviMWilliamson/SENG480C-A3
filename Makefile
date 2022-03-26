SOURCE_DIRECTORY := source
TARGET_DIRECTORY := distribution

SOURCES := $(shell find $(SOURCE_DIRECTORY) -type f ! -wholename *.h)
TARGETS := $(patsubst $(SOURCE_DIRECTORY)%,$(TARGET_DIRECTORY)%,$(SOURCES))

PREPROCESSOR := $(shell which cpp)
CPPFLAGS := -traditional-cpp -P -undef -Wundef -std=c99 -nostdinc -Wtrigraphs -fdollars-in-identifiers

all: $(TARGETS)

$(TARGETS): $(SOURCES)
	@mkdir -p $(@D)
	$(PREPROCESSOR) $(CPPFLAGS) -C $(patsubst $(TARGET_DIRECTORY)%,$(SOURCE_DIRECTORY)%,$@) > $@

.PHONY: clean
clean:
	rm -rf $(TARGET_DIRECTORY)

.PHONY: run
run: all
	@cd distribution && python3 -m http.server

.PHONY: watch
watch: all
	while true do; do \
		make clean; \
		make all; \
		inotifywait -qre close_write .; \
	done

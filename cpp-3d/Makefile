CXX = g++
CXXFLAGS = -Wall -O3
HDRS = header.h
OBJS = main.o

%.o : %.cpp $(HDRS)
	$(CXX) $(CXXFLAGS) -o $@ -c $<

drone: $(OBJS)
	$(CXX) -o $@ $^

all: drone

.PHONY: clean
clean:
	rm *.o
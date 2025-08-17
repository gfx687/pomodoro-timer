install:
	@if ! [ "$(shell id -u)" = 0 ]; then \
		 echo "Installation of a systemd service requires running this with SUDO" ;\
		 exit 1 ;\
	fi;\

	systemctl stop pomodoro-timer.service || true
	systemctl disable pomodoro-timer.service || true
	rm -f /etc/systemd/system/pomodoro-timer.*
	cp pomodoro-timer.service /etc/systemd/system/pomodoro-timer.service
	systemctl daemon-reload


uninstall:
	@if ! [ "$(shell id -u)" = 0 ]; then \
		 echo "Installation of a systemd service requires running this with SUDO" ;\
		 exit 1 ;\
	fi;\

	systemctl stop pomodoro-timer.service || true
	systemctl disable pomodoro-timer.service || true
	rm -f /etc/systemd/system/pomodoro-timer.*
	systemctl daemon-reload
Báo cáo doanh thu:

* Có 8 loại hình:
- Du học (DH)
- Khoá học luyện thi(KH)
- Kids(Kids)
- Debate 
- Ngoại khoá (NK)
- Công nghệ ( 'Công nghệ' hoặc 'Kite')
- Trại hè (Camp)
- Commission

- Tab Báo cáo,Nhắc việc chuyển thành: Tab1, Tab2, Tab3.

# UI/UX chung:
* MultiSelect combobox có tích "Tất cả" ở đầu danh sách để chọn/bỏ chọn tất cả cùng lúc.
* Dropdown của MultiSelect được Teleport ra body để tránh bị che bởi overflow:hidden.
* Mỗi biểu đồ có subtitle ghi rõ đang tổng hợp theo cột nào trong Excel, ví dụ: "Tổng doanh thu: Quà tặng, DT sau quà tặng".
* Tooltip biểu đồ dùng HTML external tooltip (không dùng canvas tooltip) để tránh bị cắt bởi viền canvas.

# Tab1:
* Ở Tab1 chỗ lọc Tất cả đơn vị sửa thành 2 ô datebox lọc (đặt tên là Date_Filter cho các lần nhắc sau) trong khoảng thời gian từ tháng đến tháng.
* Layout 3 dòng, mỗi dòng 2 cột.

## Dòng 1 (Row 1):
- Cột trái: Card KPI tổng hợp 5 chỉ số:
 + Tổng doanh thu: tổng cột 'Doanh thu thực tế'
 + Tổng quà tặng: tổng cột 'Quà Tặng'
 + DT sau quà tặng: tổng cột 'Doanh thu sau quà tặng'
 + Số lượng đơn hàng mới: tổng count_dkm từ biểu đồ Số lượng đơn hàng theo phân loại học sinh (cột 'Phân loại học sinh chuẩn' = 'Đăng ký mới')
 + Số lượng đơn hàng hoàn thiện: tổng count_ht (cột 'Phân loại học sinh chuẩn' = 'Hoàn thiện')
 + Ring chỉ báo: dtSauQua / dtThucTe * 100%

- Cột phải: 2 biểu đồ donut cạnh nhau:
 + Doanh thu từng loại hình: biểu đồ donut theo 8 loại hình, hiển thị cả số tiền và % trong legend + tooltip. Dữ liệu: tổng 'Doanh thu sau quà tặng' theo 'Loại hình'.
   Subtitle: "Doanh thu: DT sau quà tặng, Loại hình"
 + Doanh thu theo chi nhánh: biểu đồ donut, tổng cột 'Doanh thu thực tế' theo từng chi nhánh ở cột 'CN'. Hiển thị số tiền và % trong legend + tooltip.
   Subtitle: "Doanh thu: DT thực tế, CN"

## Dòng 2 (Row 2):
- Tổng số lượng đơn hàng từng loại hình dịch vụ:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng: có 2 loại  'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Lấy các bản ghi có cột 'Phân loại học sinh chuẩn' là các dữ liệu :  Đăng ký mới, Hoàn thiện
 + Tổng số lượng những bản ghi cùng 'Phân loại học sinh chuẩn' và 'Loại hình' trong khoảng thời gian đã lọc 
 + Ghi rõ số lượng của từng loại vào từng cột luôn, số của từng loại và số tổng.
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.
 + Subtitle: "Số đơn hàng: Theo đăng ký mới và hoàn thiện"

- Tổng doanh thu từng team:
 + có combobox chọn loại: Team, Chi nhánh
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng team ở cột 'Team'
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng chi nhánh ở cột 'CN'
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.
 + Subtitle: "Doanh thu: DT sau quà tặng"

- Xếp hạng doanh số từng sale 
 + Tổng doanh thu ở cột ' Doanh thu sau quà tặng ' của từng sale 'SALE' từ cao xuống thấp dạng bảng. 
 + Trong bảng có các cột STT, Mã NV, Tên sale, Tổng doanh thu, Du học (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là DH), Đào tạo (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là KH, Kids hoặc Debate), Ngoại khóa (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là NK, Công nghệ hoặc Kite), Khác (là các 'Loại hình' còn lại)
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Doanh thu theo từng nguồn data, ví dụ: doanh thu đến từ nguồn FB hay từ nguồn học sinh du học (HSĐH)...
 + Biểu đồ tròn
 + Tổng cột ' Doanh thu thực tế ' theo từng 'Phân loại nguồn data'
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.
 + Subtitle: "Doanh thu: DT thực tế, Nguồn"

# Tab2:
* Tab2 không có filter bar riêng, dùng chung Date_Filter của DashboardView (giống Tab1, nhận appliedFrom / appliedTo qua props).
* Dữ liệu các bản ghi lấy lên báo cáo dựa theo cột 'Tháng ghi nhận doanh thu' và 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc.
* Trục X của tất cả biểu đồ là từng tháng trong khoảng filter, hiển thị dạng "Th1/24", "Th2/24"... kể cả tháng không có dữ liệu.
* Layout 2 cột, 3 hàng, chiều cao mỗi hàng bằng nhau, lấp đầy màn hình không scroll.
* Tiêu đề biểu đồ không có "theo tháng" hay "từng tháng".
* Không có bảng Phân tích tỷ lệ doanh thu & số lượng đơn hàng từng sale và Xếp hạng doanh số từng sale ở Tab2.

Layout Tab2 (6 ô, hàng 3 ô cuối bên phải để trống):
- Hàng 1: [Tổng doanh thu] | [Số lượng đơn hàng]
- Hàng 2: [Doanh thu theo loại hình (full width → chiếm 2 cột)] | [Biến động doanh thu theo Team]
- Hàng 3: [Số lượng sale hoạt động] | [trống]

- Tổng doanh thu:
 + Biểu đồ cột xếp chồng, mỗi cột là 1 tháng
 + Có 2 loại trong 1 cột: 'Quà Tặng' (cam) bên dưới, 'Doanh thu sau quà tặng' (xanh) bên trên
 + Hiển thị số tổng trên đỉnh mỗi cột
 + Tooltip hover hiện cả 2 giá trị và tổng
 + Subtitle: "Tổng doanh thu: Quà tặng, DT sau quà tặng"

- Số lượng đơn hàng:
 + Biểu đồ cột xếp chồng, mỗi cột là 1 tháng
 + Có 2 loại: 'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Đếm số bản ghi theo từng loại 'Phân loại học sinh chuẩn' trong từng tháng
 + Hiển thị số lượng từng loại và tổng trên cột
 + Subtitle: "Số đơn hàng: Theo đăng ký mới và hoàn thiện"

- Doanh thu theo loại hình (full width, chiếm cả hàng):
 + Biểu đồ cột xếp chồng, mỗi cột là 1 tháng
 + Có 8 loại hình xếp chồng trong 1 cột, mỗi loại 1 màu riêng
 + Tổng cột 'Doanh thu sau quà tặng' theo từng loại hình trong từng tháng
 + Chú thích (legend) hiển thị cùng hàng với tiêu đề biểu đồ
 + Subtitle: "Doanh thu: DT sau quà tặng, Loại hình"

- Biến động doanh thu theo Team:
 + Combobox chọn team (danh sách các team từ dữ liệu)
 + Biểu đồ line, mỗi nhân viên trong team được chọn là 1 đường riêng
 + Tổng cột 'Doanh thu sau quà tặng' của từng sale trong team đó theo từng tháng
 + Legend hiển thị tên nhân viên, nếu quá nhiều thì wrap 2 dòng, phần còn lại hiện "+N"
 + Hover vào "+N" badge sẽ hiện popup danh sách nhân viên bị ẩn kèm màu tương ứng
 + Subtitle: "Doanh thu: DT sau quà tặng, Team, Sale"

- Số lượng sale hoạt động:
 + Biểu đồ line, 1 đường duy nhất
 + Đếm số sale phát sinh doanh thu (có ít nhất 1 bản ghi) trong từng tháng
 + Hiển thị giá trị trên mỗi điểm
 + Subtitle: "Số nhân viên: Sale"

# Tab3:
* Ở Tab3 chỗ lọc Date_Filter chỉ cho chọn trong khoảng thời gian từ tháng đến tháng trong 1 năm.
* Yêu cầu: 8 biểu đồ trên 1 dashboard tùy chọn loại biểu đồ phù hợp với từng loại dữ liệu.
- Tổng doanh thu:
 + theo từng tháng, là biểu đồ có 2 line
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Số lượng học sinh đki từng dịch vụ: trong 1 kỳ sẽ có hs đki mới, hs hoàn thiện phí 
 + theo từng tháng, là biểu đồ có 2 line
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.
 
- Biến động doanh thu từng sale/team qua từng tháng, so sánh số cùng kì năm trc năm sau
- Phân tích tỷ lệ doanh thu & số lượng đơn hàng của từng sale 
- Xếp hạng doanh số từng sale 
- Biến động số lượng sale đang làm việc/onboard/nghỉ việc
- Doanh thu theo từng nguồn data, ví dụ: doanh thu đến từ nguồn FB hay từ nguồn học sinh du học (HSĐH)...
